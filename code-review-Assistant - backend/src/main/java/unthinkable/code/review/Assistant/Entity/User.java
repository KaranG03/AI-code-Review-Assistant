package unthinkable.code.review.Assistant.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "users")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @JsonIgnore
    private ObjectId objectId;

    @Indexed(unique = true)
    private String clerkId;  // Unique Clerk user ID

    private String username;
    private String mail;

    private List<Code> code;


    @JsonProperty("id")
    public String getId() {
        return objectId != null ? objectId.toHexString() : null;
    }

    public void setId(ObjectId objectId) {
        this.objectId = objectId;
    }
}
