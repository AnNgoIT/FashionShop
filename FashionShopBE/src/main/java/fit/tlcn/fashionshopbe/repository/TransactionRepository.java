package fit.tlcn.fashionshopbe.repository;

import fit.tlcn.fashionshopbe.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    @Query("SELECT t " +
            "FROM Transaction t " +
            "WHERE YEAR(t.createdAt) = :year")
    List<Transaction> findByYear(Integer year);

    @Query("SELECT t " +
            "FROM Transaction t " +
            "WHERE YEAR(t.createdAt) = :year " +
            "AND MONTH(t.createdAt) = :month")
    List<Transaction> findByMonth(Integer year, Integer month);

    @Query("SELECT t " +
            "FROM Transaction t " +
            "WHERE YEAR(t.createdAt) = :year " +
            "AND MONTH(t.createdAt) = :month " +
            "AND DAY(t.createdAt) = :day")
    List<Transaction> findByDay(Integer year, Integer month, Integer day);
}
