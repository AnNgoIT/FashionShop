package fit.tlcn.fashionshopbe.controller.ShipperController;

import fit.tlcn.fashionshopbe.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/shippers")
public class ShipperController {
    @Autowired
    UserService userService;
}
