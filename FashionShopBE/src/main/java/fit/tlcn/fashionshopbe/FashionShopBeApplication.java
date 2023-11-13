package fit.tlcn.fashionshopbe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication()
@EnableScheduling
public class FashionShopBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(FashionShopBeApplication.class, args);
    }

}
