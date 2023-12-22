import * as React from "react";
import {
  DataGrid,
  GridToolbar,
  GridRowsProp,
  GridColDef,
} from "@mui/x-data-grid";
import { FormatPrice } from "@/features/product/FilterAmount";
import { Transaction } from "@/features/types";

export default function ExportDefaultToolbar({
  transactionList,
}: {
  transactionList: Transaction[];
}) {
  const rows: GridRowsProp = transactionList
    .map((transaction) => {
      return {
        id: transaction.transactionId,
        orderId: transaction.order.orderId,
        paymentMethod:
          transaction.order.paymentMethod === "COD"
            ? "Thanh toán khi nhận"
            : "Ví điện tử VNPay",
        fullname: transaction.order.fullName,
        address: transaction.order.address.split(" - "),
        phone: transaction.order.phone,
        totalAmount: `${FormatPrice(transaction.amount)} VNĐ`,
      };
    })
    .sort((a, b) => b.orderId - a.orderId);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Mã giao dịch", width: 100 },
    { field: "fullname", headerName: "Tên khách hàng", width: 150 },
    {
      field: "paymentMethod",
      headerName: "Phương thức thanh toán",
      width: 180,
    },
    { field: "address", headerName: "Địa chỉ", width: 250 },
    { field: "phone", headerName: "Số điện thoại", width: 150 },
    { field: "totalAmount", headerName: "Tổng tiền đơn hàng", width: 180 },
  ];

  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
      />
    </div>
  );
}
