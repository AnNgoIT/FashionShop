import Checkout from "@/container/cart/checkout";

export type OrderItem = {
  id: number;
  name?: string;
  price: number;
  quantity: number;
};

const CheckoutPage = () => {
  return <Checkout />;
};

export default CheckoutPage;
