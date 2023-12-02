export const Total = (totalItems: any[]): number => {
  const cartList = [...totalItems];
  let totalPrice = 0;
  cartList.map((item: any) => {
    totalPrice += item.productPromotionalPrice * item.quantity;
  });
  return totalPrice;
};
