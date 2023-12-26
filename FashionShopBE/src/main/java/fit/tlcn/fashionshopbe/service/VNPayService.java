package fit.tlcn.fashionshopbe.service;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;

public interface VNPayService {
    String getPaymentPayUrl(Integer orderId, Float totalAmount) throws UnsupportedEncodingException;
    void PaymentPayCallBack(Map<String, String> queryParams, HttpServletResponse response) throws IOException;
}
