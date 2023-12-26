package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.config.VNPayConfig;
import fit.tlcn.fashionshopbe.constant.Status;
import fit.tlcn.fashionshopbe.constant.TransactionType;
import fit.tlcn.fashionshopbe.entity.*;
import fit.tlcn.fashionshopbe.repository.*;
import fit.tlcn.fashionshopbe.service.VNPayService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VNPayServiceImpl implements VNPayService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    ProductItemRepository productItemRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    TransactionRepository transactionRepository;

    public String getPaymentPayUrl(Integer orderId, Float totalAmount) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long amount = totalAmount.longValue() * 100;
//        String bankCode = "NCB";

        String vnp_TxnRef = VNPayConfig.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";

        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

//        vnp_Params.put("vnp_BankCode", bankCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang: " + orderId);
        vnp_Params.put("vnp_OrderType", orderType);

        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnPayUrl
                + "?orderId=" + orderId.toString());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VNPayConfig.vnp_PayUrl + "?" + queryUrl;

        return paymentUrl;
    }

    public void PaymentPayCallBack(Map<String, String> queryParams, HttpServletResponse response) throws IOException {
        String vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
        String vnp_TransactionNo = queryParams.get("vnp_TransactionNo");
        String vnp_OrderInfo = queryParams.get("vnp_OrderInfo");
        Integer orderId = Integer.parseInt(queryParams.get("orderId"));
        Float amount = Float.parseFloat(queryParams.get("vnp_Amount")) / 100;
        Order order = orderRepository.findByOrderId(orderId);
        if ("00".equals(vnp_ResponseCode)) {
            List<OrderItem> orderItemList = orderItemRepository.findAllByOrder(order);

            for (OrderItem orderItem : orderItemList) {
                ProductItem productItem = orderItem.getProductItem();
                productItem.setSold(productItem.getSold() + orderItem.getQuantity());
                productItemRepository.save(productItem);

                Product product = productItem.getParent();
                product.setTotalSold(product.getTotalSold() + orderItem.getQuantity());
                productRepository.save(product);
            }

            order.setStatus(Status.PROCESSING);
            order.setCheckout(true);
            orderRepository.save(order);

            Transaction transaction = new Transaction();
            transaction.setTransactionId(vnp_TransactionNo);
            transaction.setOrder(order);
            transaction.setTransactionType(TransactionType.PAY);
            transaction.setAmount(amount);
            transaction.setContent(vnp_OrderInfo);

            transactionRepository.save(transaction);

            response.sendRedirect("http://localhost:3000/success-payment");
        } else {
            List<OrderItem> orderItemList = orderItemRepository.findAllByOrder(order);
            for (OrderItem orderItem : orderItemList) {
                orderItemRepository.delete(orderItem);
            }
            orderRepository.delete(order);
            response.sendRedirect("http://localhost:3000/fail-payment");
        }
    }
}
