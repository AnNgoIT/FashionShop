package fit.tlcn.fashionshopbe;

import fit.tlcn.fashionshopbe.security.oauth2.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication()
@EnableScheduling
@EnableConfigurationProperties(AppProperties.class)
public class FashionShopBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(FashionShopBeApplication.class, args);
    }

}
