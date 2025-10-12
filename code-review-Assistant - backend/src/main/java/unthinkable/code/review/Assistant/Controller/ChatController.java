package unthinkable.code.review.Assistant.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import unthinkable.code.review.Assistant.Entity.Code;
import unthinkable.code.review.Assistant.Entity.User;
import unthinkable.code.review.Assistant.Repository.UserRepo;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@RestController
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final ChatClient chatClient;
    private final UserRepo userRepository;
    private final ObjectMapper objectMapper;

    public ChatController(ChatClient.Builder chatClientBuilder,
                          UserRepo userRepository,
                          ObjectMapper objectMapper) {
        this.chatClient = chatClientBuilder.build();
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @PostMapping(value = "/review-code", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> reviewCode(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal Jwt jwt) {

        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"User not authenticated.\"}");
        }
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Please upload a non-empty file.\"}");
        }

        try {
            // Step 1: Get user identity from JWT
            String clerkId = jwt.getSubject();
            User user = userRepository.findByClerkId(clerkId)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setClerkId(clerkId);
                        newUser.setMail(jwt.getClaimAsString("email"));
                        newUser.setCode(new ArrayList<>());
                        return userRepository.save(newUser);
                    });

            // Step 2: Call AI for code review
            String sourceCode = new String(file.getBytes());
            String fileExtension = getFileExtension(file.getOriginalFilename()).orElse("unknown");
            String prompt = createReviewPrompt(sourceCode, fileExtension);
            String jsonResponse = cleanJsonResponse(chatClient.prompt().user(prompt).call().content());

            // Step 3: Parse and save the review
            Code newCodeReview;
            try {
                newCodeReview = objectMapper.readValue(jsonResponse, Code.class);
            } catch (JsonProcessingException e) {
                logger.error("!!! FAILED TO PARSE AI RESPONSE !!!");
                logger.error("Error Message: {}", e.getMessage());
                logger.error("Raw AI JSON Response was: {}", jsonResponse);
                return ResponseEntity.internalServerError().body("{\"error\": \"Could not process the AI's response.\"}");
            }

            newCodeReview.setReviewedAt(LocalDateTime.now());
            if (user.getCode() == null) {
                user.setCode(new ArrayList<>());
            }
            user.getCode().add(newCodeReview);
            userRepository.save(user);

            return ResponseEntity.ok(newCodeReview);

        } catch (Exception e) {
            logger.error("An unexpected error occurred in /review-code", e);
            return ResponseEntity.internalServerError()
                    .body("{\"error\": \"An unexpected server error occurred.\"}");
        }
    }

    private String cleanJsonResponse(String response) {
        if (response == null) return "{}";
        response = response.strip();
        if (response.startsWith("```")) {
            int firstLineEnd = response.indexOf("\n");
            int lastBackticks = response.lastIndexOf("```");
            if (lastBackticks > firstLineEnd) {
                response = response.substring(firstLineEnd + 1, lastBackticks).trim();
            }
        }
        return response;
    }

    private String createReviewPrompt(String code, String extension) {
        return """
        You are an expert code analysis tool. Your ONLY output must be a single, valid JSON object. Do not add any text before or after the JSON.
        ---
        CRITICAL INSTRUCTIONS FOR COMPLEXITY:
        1. For the "Time Complexity" and "Space Complexity" keys, the value MUST be a string containing ONLY the Big O notation for the single, overall worst-case complexity of the entire code.
        2. DO NOT include explanations, method names, or descriptive text in the complexity value.

        - CORRECT Example for the value: "O(n^2)"
        - INCORRECT Example for the value: "The function has a complexity of O(n^2) because of the nested loop."
        ---
        Analyze the following source code from a file with extension '%s':
        ```
        %s
        ```

        Generate a single JSON object with the exact keys and structure shown below.
        
        

        JSON Structure to use:
        {
          "Language Detected": "",
          "Correct Code": "",
          "Time Complexity": "",
          "Space Complexity": "",
          "Summary": "",
          "Positive Feedback": [],
          "Critical issues": [],
          "Security Vulnerabilities": [],
          "Suggestions for improvement": [],
          "Testability": []
        }
        """.formatted(extension, code);
    }

    private Optional<String> getFileExtension(String filename) {
        return Optional.ofNullable(filename)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(filename.lastIndexOf('.')));
    }
}