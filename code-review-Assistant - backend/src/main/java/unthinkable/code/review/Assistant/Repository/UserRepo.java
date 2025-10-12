package unthinkable.code.review.Assistant.Repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import unthinkable.code.review.Assistant.Entity.User;

import java.util.Optional;

public interface UserRepo extends MongoRepository<User, ObjectId> {
    User findByusername(String username);
    Optional<User> findByClerkId(String clerkId);

    User findBymail(String mail);
}