import * as React from "react";
import {
  DataGrid,
  GridToolbar,
  GridRowsProp,
  GridColDef,
} from "@mui/x-data-grid";
import { orderItem } from "@/features/types";
import { FormatPrice } from "@/features/product/FilterAmount";

export default function ExportDefaultToolbar({
  orders,
}: {
  orders: orderItem[];
}) {
  const rows: GridRowsProp = orders
    .map((order) => {
      return {
        id: order.orderId,
        fullname: order.fullName,
        address: order.address,
        phone: order.phone,
        totalAmount: `${FormatPrice(order.totalAmount)} VNĐ`,
      };
    })
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Mã đơn hàng", width: 100 },
    { field: "fullname", headerName: "Tên khách hàng", width: 150 },
    { field: "address", headerName: "Địa chỉ", width: 600 },
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
