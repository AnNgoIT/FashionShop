package fit.tlcn.fashionshopbe.dto;

import lombok.*;

@Getter
@Setter
@Builder
public class GenericResponse {
    private Boolean success;
    private String message;
    private Object result;
    private int statusCode;
}
