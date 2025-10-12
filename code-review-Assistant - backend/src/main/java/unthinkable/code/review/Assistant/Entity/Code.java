package unthinkable.code.review.Assistant.Entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Code {

    // Use @JsonProperty to map the JSON keys (with spaces) to your Java fields.
    @JsonProperty("Language Detected")
    private String languageDetected;

    @JsonProperty("Correct Code")
    private String correctCode;

    @JsonProperty("Time Complexity")
    private String timeComplexity;

    @JsonProperty("Space Complexity")
    private String spaceComplexity;

    @JsonProperty("Summary")
    private String summary;

    @JsonProperty("Positive Feedback")
    private List<String> positiveFeedback;

    @JsonProperty("Critical issues")
    private List<String> criticalIssues;

    @JsonProperty("Security Vulnerabilities")
    private List<String> securityVulnerabilities;

    @JsonProperty("Suggestions for improvement")
    private List<String> suggestionsForImprovement;

    @JsonProperty("Testability")
    private List<String> testability;

    // Add a timestamp for when the review was created.
    private LocalDateTime reviewedAt;
}