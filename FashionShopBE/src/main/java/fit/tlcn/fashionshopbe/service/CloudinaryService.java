package fit.tlcn.fashionshopbe.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CloudinaryService {
    String uploadCategoryImage(MultipartFile file) throws IOException;

    String uploadProductImage(MultipartFile file) throws IOException;

    String uploadUserAvatar(MultipartFile avatar) throws IOException;

    String uploadBanner(MultipartFile banner) throws IOException;

    void deleteAvatar(String avatarUrl) throws IOException;

    void deleteCategoryImage(String imageUrl) throws IOException;

    void deleteProductImage(String imageUrl) throws IOException;
}
