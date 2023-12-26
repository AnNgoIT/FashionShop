package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmailAndIsActiveIsTrue(String emailOrPhone);

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    Optional<User> findByEmailAndIsVerifiedIsTrueAndIsActiveIsTrue(String email);

    Optional<User> findByEmailAndIsVerifiedIsFalse(String email);

    List<User> findAllByRole_NameAndAddress(String roleName, String address);

    List<User> findAllByRole_NameOrderByCreatedAtDesc(String roleName);

    long countByIsActiveIsTrueAndIsVerifiedIsTrue();

    @Query("SELECT COUNT(*) " +
            "FROM User u " +
            "WHERE YEAR(u.createdAt) = :year " +
            "AND u.isActive = true " +
            "AND u.isVerified = true")
    long countNewUsersByYear(Integer year);

    @Query("SELECT COUNT(*) " +
            "FROM User u " +
            "WHERE YEAR(u.createdAt) = :year " +
            "AND MONTH(u.createdAt) = :month " +
            "AND u.isActive = true " +
            "AND u.isVerified = true")
    long countNewUsersByMonth(Integer year, Integer month);

    @Query("SELECT COUNT(*) " +
            "FROM User u " +
            "WHERE YEAR(u.createdAt) = :year " +
            "AND MONTH(u.createdAt) = :month " +
            "AND DAY(u.createdAt) = :day " +
            "AND u.isActive = true " +
            "AND u.isVerified = true")
    long countNewUsersByDay(Integer year, Integer month, Integer day);

    Optional<User> findByEmailAndRole_Name(String shipperEmail, String roleName);
}
