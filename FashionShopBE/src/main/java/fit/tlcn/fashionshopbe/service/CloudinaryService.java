package fit.tlcn.fashionshopbe.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CloudinaryService {
    String uploadCategoryImage(MultipartFile file) throws IOException;

    String uploadProductImage(MultipartFile file) throws IOException;

    String uploadUserAvatar(MultipartFile avatar) throws IOException;

    void deleteAvatar(String avatarUrl) throws IOException;
}
