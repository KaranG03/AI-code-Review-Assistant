package unthinkable.code.review.Assistant.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import unthinkable.code.review.Assistant.Entity.Code;
import unthinkable.code.review.Assistant.Entity.User;
import unthinkable.code.review.Assistant.Repository.UserRepo;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/sync")
    public ResponseEntity<?> syncUser(@AuthenticationPrincipal Jwt jwt) {
        // Extract info from Clerk JWT
        String clerkId = jwt.getSubject();
        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");

        // Check if user exists
        User existing = userRepo.findBymail(email);
        if (existing == null) {
            User newUser = new User();
            newUser.setMail(email);
            newUser.setUsername(name);
            newUser.setClerkId(clerkId);
            userRepo.save(newUser);
        }

        return ResponseEntity.ok("User synced successfully");
    }


    @GetMapping("/history")
    public ResponseEntity<List<Code>> getReviewHistory(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            // This case should be handled by Spring Security, but it's a good safeguard.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String clerkId = jwt.getSubject();

        // Find the user by their Clerk ID and map the result to their list of codes.
        // If the user doesn't exist, it gracefully returns an empty list.
        List<Code> history = userRepo.findByClerkId(clerkId)
                .map(User::getCode) // If user is present, get their code list
                .orElse(Collections.emptyList()); // Otherwise, return an empty list

        return ResponseEntity.ok(history);
    }



}
