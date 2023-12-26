package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.dto.CreateBrandRequest;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.UpdateBrandRequest;
import fit.tlcn.fashionshopbe.entity.Brand;
import fit.tlcn.fashionshopbe.repository.BrandRepository;
import fit.tlcn.fashionshopbe.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BrandServiceImpl implements BrandService {
    @Autowired
    BrandRepository brandRepository;

    @Override
    public ResponseEntity<GenericResponse> createBrand(CreateBrandRequest request) {
        try {
            Optional<Brand> brandOptional = brandRepository.findByName(request.getName());
            if (brandOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Brand already exists")
                                .result("Conflict")
                                .statusCode(HttpStatus.CONFLICT.value())
                                .build()
                );
            }

            Brand brand = new Brand();
            brand.setName(request.getName());
            brand.setNation(request.getNation());
            brandRepository.save(brand);

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Brand is created successfully")
                            .result(brand)
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

    @Override
    public ResponseEntity<GenericResponse> updateBrand(Integer brandId, UpdateBrandRequest request) {
        try {
            Optional<Brand> brandOptional = brandRepository.findById(brandId);
            if (brandOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("Not found brand")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build()
                );
            }

            Brand brand = brandOptional.get();
            if (request.getName() != null) {
                if (request.getName().equals(brand.getName())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("New brand's name must difference from brand's name in the present")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build()
                    );
                }

                Optional<Brand> brandNameOptionnal = brandRepository.findByName(request.getName());
                if (brandNameOptionnal.isPresent()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("This name already exist")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build()
                    );
                }

                brand.setName(request.getName());
            }

            if (request.getNation() != null) {
                if (request.getNation().equals(brand.getNation())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                            GenericResponse.builder()
                                    .success(false)
                                    .message("New brand's nation must difference from brand's nation in the present")
                                    .result("Bad request")
                                    .statusCode(HttpStatus.BAD_REQUEST.value())
                                    .build()
                    );
                }

                brand.setNation(request.getNation());
            }

            brandRepository.save(brand);
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Updated brand successfully")
                            .result(brand)
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
