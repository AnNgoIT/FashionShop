package fit.tlcn.fashionshopbe.service.impl;

import fit.tlcn.fashionshopbe.constant.Status;
import fit.tlcn.fashionshopbe.dto.GenericResponse;
import fit.tlcn.fashionshopbe.dto.OrderItemResponse;
import fit.tlcn.fashionshopbe.entity.Order;
import fit.tlcn.fashionshopbe.entity.OrderItem;
import fit.tlcn.fashionshopbe.entity.StyleValue;
import fit.tlcn.fashionshopbe.repository.OrderItemRepository;
import fit.tlcn.fashionshopbe.repository.OrderRepository;
import fit.tlcn.fashionshopbe.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Override
    public ResponseEntity<GenericResponse> getOrderByStatus(Status status) {
        try {
            List<Order> orderList = orderRepository.findAllByStatusCheck(status);
            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Successful")
                            .result(orderList)
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
    public ResponseEntity<GenericResponse> getOrderByOrderId(Integer orderId) {
        try {
            Optional<Order> orderOptional = orderRepository.findById(orderId);
            if(orderOptional.isEmpty()){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        GenericResponse.builder()
                                .success(false)
                                .message("OrderId " + orderId + "does not exist")
                                .result("Not found")
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .build()
                );
            }

            List<OrderItem> orderItemList = orderItemRepository.findAllByOrder(orderOptional.get());

            List<OrderItemResponse> orderItemResponseList = new ArrayList<>();
            for (OrderItem orderItem : orderItemList) {
                OrderItemResponse orderItemResponse = new OrderItemResponse();
                orderItemResponse.setOrderItemId(orderItem.getOrderItemId());
                orderItemResponse.setProductItemId(orderItem.getProductItem().getProductItemId());
                orderItemResponse.setProductName(orderItem.getProductItem().getParent().getName());
                orderItemResponse.setImage(orderItem.getProductItem().getImage());
                List<String> styleValueNames = new ArrayList<>();
                for (StyleValue styleValue : orderItem.getProductItem().getStyleValues()) {
                    styleValueNames.add(styleValue.getName());
                }
                orderItemResponse.setStyleValues(styleValueNames);
                orderItemResponse.setQuantity(orderItem.getQuantity());
                orderItemResponse.setProductPrice(orderItem.getProductItem().getPrice());
                orderItemResponse.setProductPromotionalPrice(orderItem.getProductItem().getPromotionalPrice());
                orderItemResponse.setAmount(orderItem.getAmount());

                orderItemResponseList.add(orderItemResponse);
            }

            Order order = orderOptional.get();
            Map<String, Object> map = new HashMap<>();
            map.put("order", order);
            map.put("orderItems", orderItemResponseList);
            map.put("totalOrderItems", orderItemResponseList.size());

            return ResponseEntity.status(HttpStatus.OK).body(
                    GenericResponse.builder()
                            .success(true)
                            .message("Get this order successfully")
                            .result(map)
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
