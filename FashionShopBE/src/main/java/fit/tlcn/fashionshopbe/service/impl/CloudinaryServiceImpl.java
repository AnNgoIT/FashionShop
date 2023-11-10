package fit.tlcn.fashionshopbe.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import fit.tlcn.fashionshopbe.service.CloudinaryService;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {
    @Autowired
    Cloudinary cloudinary;

    @Override
    public String uploadCategoryImage(MultipartFile file) throws IOException {
        if (file == null) {
            throw new IllegalArgumentException("File is null. Please upload a valid file.");
        }

        // Kiểm tra định dạng file sử dụng Apache Tika
        Tika tika = new Tika();
        String contentType = tika.detect(file.getInputStream());
        if (!contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed.");
        }

        Map<String, String> params = ObjectUtils.asMap(
                "folder", "FashionShop/Category",
                "resource_type", "image");
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
        return (String) uploadResult.get("secure_url");
    }

    @Override
    public List<String> uploadProductImages(List<MultipartFile> files) throws IOException {
        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("File is null. Please upload a valid file.");
            }

            Tika tika = new Tika();
            String contentType = tika.detect(file.getInputStream());
            if (!contentType.startsWith("image/")) {
                throw new IllegalArgumentException("Only image files are allowed.");
            }

            Map<String, String> params = ObjectUtils.asMap(
                    "folder", "FashionShop/Product",
                    "resource_type", "image");
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            String imageUrl = (String) uploadResult.get("secure_url");
            imageUrls.add(imageUrl);
        }

        return imageUrls;
    }
}
