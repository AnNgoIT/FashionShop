export function onlyNumbers(event: any) {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    event.preventDefault();
  }
}

export function MaxAmounts(amount: number, maxAmount: number) {
  if (amount > maxAmount) {
    return false;
  }
  return true;
}
export function FormatPrice(price: number): string {
  const formattedPrice = price.toLocaleString().replace(",", ".");
  return formattedPrice;
}
