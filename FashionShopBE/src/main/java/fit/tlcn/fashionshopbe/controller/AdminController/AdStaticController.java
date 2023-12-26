package fit.tlcn.fashionshopbe.controller.AdminController;


import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.entity.Transaction;
import fit.tlcn.fashionshopbe.repository.TransactionRepository;
import fit.tlcn.fashionshopbe.repository.UserRepository;
import fit.tlcn.fashionshopbe.service.TransactionService;
import fit.tlcn.fashionshopbe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.management.ObjectName;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users/admin/statistics")
public class AdStaticController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    TransactionRepository transactionRepository;

    @GetMapping("/total-users")
    public ResponseEntity<GenericResponse> getTotalUsers() {
        try {
            long totalUsers = userRepository.countByIsActiveIsTrueAndIsVerifiedIsTrue();
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Get total users successfully")
                            .result(totalUsers)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @GetMapping("/new-users/years")
    public ResponseEntity<GenericResponse> getNewUsersByYear(@RequestParam Integer year) {
        try {
            long newUsersByYear = userRepository.countNewUsersByYear(year);
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Get new users by year " + year + " successfully")
                            .result(newUsersByYear)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @GetMapping("/new-users/months")
    public ResponseEntity<GenericResponse> getNewUsersByMonth(@RequestParam Integer year,
                                                              @RequestParam Integer month) {
        try {
            long newUsersByMonth = userRepository.countNewUsersByMonth(year, month);
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Get new users by " + month + "/" + year + " successfully")
                            .result(newUsersByMonth)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @GetMapping("/new-users/days")
    public ResponseEntity<GenericResponse> getNewUsersByDay(@RequestParam Integer year,
                                                            @RequestParam Integer month,
                                                            @RequestParam Integer day) {
        try {
            long newUsersByDay = userRepository.countNewUsersByDay(year, month, day);
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Get new users by " + day + "/" + month + "/" + year + " successfully")
                            .result(newUsersByDay)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @GetMapping("/total-revenues")
    public ResponseEntity<GenericResponse> getTotalRevenues() {
        try {
            List<Transaction> transactionList = transactionRepository.findAll();
            Float totalRevenues = Float.valueOf(0);
            if (!transactionList.isEmpty()) {
                for (Transaction t : transactionList) {
                    totalRevenues += t.getAmount();
                }
            }
            Map<String, Object> map = new HashMap<>();
            map.put("transactionList", transactionList);
            map.put("totalRevenues", totalRevenues);
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Get total revenues successfully")
                            .result(map)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @GetMapping("/revenue-years")
    public ResponseEntity<GenericResponse> getRevenuesByYear(@RequestParam Integer year) {
        try {
            List<Transaction> transactionList = transactionRepository.findByYear(year);
            Float revenuesByYear = Float.valueOf(0);
            if (!transactionList.isEmpty()) {
                for (Transaction t : transactionList) {
                    revenuesByYear += t.getAmount();
                }
            }

            Map<String, Object> map = new HashMap<>();
            map.put("transactionList", transactionList);
            map.put("revenuesByYear", revenuesByYear);
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Get revenue by year " + year + " successfully")
                            .result(map)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @GetMapping("/revenue-months")
    public ResponseEntity<GenericResponse> getRevenuesByMonth(@RequestParam Integer year,
                                                              @RequestParam Integer month) {
        try {
            List<Transaction> transactionList = transactionRepository.findByMonth(year, month);
            Float revenuesByMonth = Float.valueOf(0);
            if (!transactionList.isEmpty()) {
                for (Transaction t : transactionList) {
                    revenuesByMonth += t.getAmount();
                }
            }

            Map<String, Object> map = new HashMap<>();
            map.put("transactionList", transactionList);
            map.put("revenuesByMonth", revenuesByMonth);
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Get revenue by " + month + "/" + year + " successfully")
                            .result(map)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @GetMapping("/revenue-days")
    public ResponseEntity<GenericResponse> getRevenuesByDay(@RequestParam Integer year,
                                                            @RequestParam Integer month,
                                                            @RequestParam Integer day) {
        try {
            List<Transaction> transactionList = transactionRepository.findByDay(year, month, day);
            Float revenuesByDay = Float.valueOf(0);
            if (!transactionList.isEmpty()) {
                for (Transaction t : transactionList) {
                    revenuesByDay += t.getAmount();
                }
            }
            Map<String, Object> map = new HashMap<>();
            map.put("transactionList", transactionList);
            map.put("revenuesByDay", revenuesByDay);
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Get revenue by " + day + "/" + month + "/" + year + " successfully")
                            .result(map)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    GenericResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .result("Internal server error")
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }
}
