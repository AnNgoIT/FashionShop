export function onlyNumbers(event: any) {
  const charCode = event.which ? event.which : event.keyCode;
  if (
    (charCode > 31 && (charCode < 48 || charCode > 57)) || // Không phải số từ 0-9
    (charCode >= 33 && charCode <= 47) || // Ký tự đặc biệt từ ! đến /
    (charCode >= 58 && charCode <= 64) || // Ký tự đặc biệt từ : đến @
    (charCode >= 91 && charCode <= 96) || // Ký tự đặc biệt từ [ đến `
    (charCode >= 123 && charCode <= 126) // Ký tự đặc biệt từ { đến ~) {
  ) {
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
  const checkedPrice = price ? price : 0;
  const formattedPrice = checkedPrice.toLocaleString().replace(",", ".");
  return formattedPrice;
}
