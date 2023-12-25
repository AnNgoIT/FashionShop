"use client";
import { Chart } from "@/components/dashboard/Chart";
import { decodeToken } from "@/features/jwt-decode";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { getAuthenticated } from "@/hooks/useData";
import Revenue from "@/components/dashboard/Revenue";
import NewUsers from "@/components/dashboard/NewUser";
import { warningMessage } from "@/features/toasting";
import { useRouter } from "next/navigation";
import ExportDefaultToolbar from "@/components/dashboard/order-bar";
import { Product, Revenues, Transaction } from "@/features/types";
import Top3ProductsPieChart from "@/components/dashboard/Pie-Chart";
import Button from "@mui/material/Button";

type DashBoardProps = {
  token?: { accessToken?: string; refreshToken?: string };
  revenues: Revenues;
  newUsers: number;
  products: Product[];
};

type staticticsFilter = {
  day: number | string;
  month: number | string;
  year: number | string;
};
const AdminDashBoard = (props: DashBoardProps) => {
  const router = useRouter();
  const [filterValue, setFilterValue] = useState<staticticsFilter>({
    day: "Chọn",
    month: "Chọn",
    year: "Chọn",
  });

  const { token, revenues, newUsers, products } = props;

  const [totalRevenues, setTotalRevenues] = useState<number>(0);
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [filterRevenues, setFilterRevenues] = useState<number>(0);
  const [filterUsers, setFilterUsers] = useState<number>(0);
  const [filterType, setFilterType] = useState<string>("");
  useEffect(() => {
    if (revenues && newUsers) {
      setTotalRevenues(revenues.totalRevenues);
      setTotalUsers(newUsers);
    }
    revenues && setTransactionList(revenues.transactionList);
    if (token && token.accessToken && token.refreshToken) {
      setCookie("accessToken", token.accessToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(token.accessToken!)!,
      });
      setCookie("refreshToken", token.refreshToken, {
        // httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        expires: decodeToken(token.refreshToken!)!,
      });
    } else if (token && (!token.accessToken || !token.refreshToken)) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    }
  }, [newUsers, revenues, token]);

  const handleFilter = async (type: string) => {
    if (!hasCookie("accessToken") && hasCookie("refreshToken")) {
      warningMessage("Đang tạo lại phiên đăng nhập mới");
      router.refresh();
      return undefined;
    } else if (!hasCookie("accessToken") && !hasCookie("refreshToken")) {
      warningMessage("Vui lòng đăng nhập để sử dụng chức năng này");
      router.push("/login");
      router.refresh();
      return;
    }

    if (filterValue.day == "Chọn" && type == "day") {
      warningMessage("Vui lòng chọn ngày để thống kê");
      return;
    } else if (filterValue.month == "Chọn" && type == "month") {
      warningMessage("Vui lòng chọn tháng để thống kê");
      return;
    } else if (filterValue.year == "Chọn" && type == "year") {
      warningMessage("Vui lòng chọn năm để thống kê");
      return;
    }
    setFilterType(type);
    let day =
        filterValue.day !== "Chọn"
          ? "&day=" + filterValue.day
          : "&day=" + new Date().getDate(),
      month =
        filterValue.month !== "Chọn"
          ? "&month=" + filterValue.month
          : "&month=" + new Date().getMonth() + 1,
      year =
        filterValue.year !== "Chọn"
          ? "year=" + filterValue.year
          : "year=" + new Date().getFullYear();

    if (type == "day" && filterValue.day != "Chọn") {
      const [revenueRes, userRes] = await Promise.all([
        getAuthenticated(
          `/api/v1/users/admin/statistics/revenue-days?${year}${month}${day}`,
          getCookie("accessToken")!
        ),
        getAuthenticated(
          `/api/v1/users/admin/statistics/new-users/days?${year}${month}${day}`,
          getCookie("accessToken")!
        ),
      ]);
      setFilterRevenues(
        revenueRes?.success ? revenueRes.result.revenuesByDay : 0
      );
      setTransactionList(
        revenueRes?.success ? revenueRes.result.transactionList : []
      );
      setFilterUsers(userRes?.success ? userRes.result : 0);
    } else if (type == "month" && filterValue.month != "Chọn") {
      const [revenueRes, userRes] = await Promise.all([
        getAuthenticated(
          `/api/v1/users/admin/statistics/revenue-months?${year}${month}`,
          getCookie("accessToken")!
        ),
        getAuthenticated(
          `/api/v1/users/admin/statistics/new-users/months?${year}${month}`,
          getCookie("accessToken")!
        ),
      ]);
      setFilterRevenues(
        revenueRes?.success ? revenueRes.result.revenuesByMonth : 0
      );
      setTransactionList(
        revenueRes?.success ? revenueRes.result.transactionList : []
      );
      setFilterUsers(userRes?.success ? userRes.result : 0);
    } else if (type == "year" && filterValue.year != "Chọn") {
      const [revenueRes, userRes] = await Promise.all([
        getAuthenticated(
          `/api/v1/users/admin/statistics/revenue-years?${year}`,
          getCookie("accessToken")!
        ),
        getAuthenticated(
          `/api/v1/users/admin/statistics/new-users/years?${year}`,
          getCookie("accessToken")!
        ),
      ]);
      setFilterRevenues(
        revenueRes?.success ? revenueRes.result.revenuesByYear : 0
      );
      setTransactionList(
        revenueRes?.success ? revenueRes.result.transactionList : []
      );
      setFilterUsers(userRes?.success ? userRes.result : 0);
    }
  };
  const handleChangeFilter = (e: any) => {
    const value = e.target.value;
    if (value == "Chọn") {
      setFilterValue({
        day: "",
        month: "",
        year: "",
      });
      setFilterRevenues(0);
      setFilterUsers(0);
    }
    setFilterValue({
      ...filterValue,
      [e.target.name]: value,
    });
    // setFilterType("");
  };

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
              }}
            >
              <Chart />
            </Paper>
          </Grid> */}
          {/* <Grid container xs={7} item> */}
          <Grid height={"fit-content"} item xs={12}>
            <span className="text-lg font-bold">Tổng quan</span>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "fit-content",
              }}
            >
              <Revenue
                revenues={totalRevenues}
                title={"Tổng doanh thu đạt được"}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "fit-content",
              }}
            >
              <NewUsers newUsers={totalUsers} title={"Tổng số người dùng"} />
            </Paper>
          </Grid>
          {/* Recent Orders */}
          <Grid height={"fit-content"} item xs={12}>
            <span className="text-lg font-bold">Biểu đồ thống kê</span>
          </Grid>
          <Grid item xs={6}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                height: 240,
              }}
            >
              <Chart />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
              }}
            >
              <Top3ProductsPieChart
                products={products
                  .sort((a, b) => b.totalSold - a.totalSold)
                  .slice(0, 3)}
              />
            </Paper>
          </Grid>
          <Grid height={"fit-content"} item xs={12}>
            <span className="text-lg font-bold">Danh sách giao dịch</span>
          </Grid>
          <Grid item xs={12}>
            <div className="flex flex-col gap-y-2 justify-start bg-white rounded-md shadow-md p-4">
              <div className="w-full flex justify-between items-center gap-x-1 text-xl font-bold p-2 border-b border-border-color">
                <div className="flex gap-x-2 items-center">
                  <FilterAltIcon sx={{ fontSize: "1.5rem" }} />
                  Lọc theo
                </div>
                <div className="flex gap-x-2 items-center">
                  <Button onClick={() => handleFilter("day")}>Ngày</Button>
                  <Button onClick={() => handleFilter("month")}>Tháng</Button>
                  <Button onClick={() => handleFilter("year")}>Năm</Button>
                </div>
              </div>
              <div className="w-full grid grid-cols-3 gap-x-2">
                <div className="p-2 col-span-1">
                  <FormControl fullWidth>
                    <InputLabel id="day-filter-label">Ngày</InputLabel>
                    <Select
                      name="day"
                      labelId="day-filter-label"
                      id="day-filtering"
                      value={filterValue?.day || "Chọn"}
                      label="Ngày"
                      onChange={handleChangeFilter}
                    >
                      <MenuItem value={"Chọn"}>Chọn</MenuItem>
                      {Array.from(Array(31).keys())
                        .map((x) => x + 1)
                        .map((item) => {
                          return (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </div>
                <div className="p-2 col-span-1">
                  <FormControl fullWidth>
                    <InputLabel id="month-filter-label">Tháng</InputLabel>
                    <Select
                      name="month"
                      labelId="month-filter-label"
                      id="month-filtering"
                      value={filterValue?.month || "Chọn"}
                      label="Tháng"
                      onChange={handleChangeFilter}
                    >
                      <MenuItem value={"Chọn"}>Chọn</MenuItem>
                      {Array.from(Array(new Date().getMonth() + 1).keys())
                        .map((x) => x + 1)
                        .map((item) => {
                          return (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </div>
                <div className="p-2 col-span-1">
                  <FormControl fullWidth>
                    <InputLabel id="year-filter-label">Năm</InputLabel>
                    <Select
                      name="year"
                      labelId="year-filter-label"
                      id="year-filtering"
                      value={filterValue?.year || "Chọn"}
                      label="Năm"
                      onChange={handleChangeFilter}
                    >
                      <MenuItem value={"Chọn"}>Chọn</MenuItem>
                      {[2020, 2021, 2022, 2023].map((item) => {
                        return (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </Grid>
          {filterType != "" && (
            <>
              <Grid height={"fit-content"} item xs={12}>
                <span className="text-lg font-bold">
                  Doanh thu và người dùng đạt được vào{" "}
                  {filterValue.day != "Chọn" &&
                    filterType != "month" &&
                    filterType != "year" &&
                    `${filterType == "day" ? "ngày " : ""}` +
                      filterValue.day +
                      "/"}
                  {filterValue.month != "Chọn" &&
                    filterType != "year" &&
                    `${filterType == "month" ? "tháng " : ""}` +
                      filterValue.month +
                      "/"}
                  {filterValue.year != "Chọn" &&
                    `${filterType == "year" ? "năm " : ""}` + +filterValue.year}
                </span>
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={12} md={4} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "fit-content",
                  }}
                >
                  <Revenue revenues={filterRevenues} title={"Doanh thu"} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "fit-content",
                  }}
                >
                  <NewUsers newUsers={filterUsers} title={"Số người tạo mới"} />
                </Paper>
              </Grid>
            </>
          )}
          <Grid item xs={12} md={4} lg={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "fit-content",
              }}
            >
              <ExportDefaultToolbar transactionList={transactionList} />
            </Paper>
            {/* <Paper
              sx={{
                p: 2,
                marginTop: "8px",
                display: "flex",
                flexDirection: "column",
                minHeight: "11rem",
                width: "100%",
              }}
            >
              <NewUsersChart />
            </Paper> */}
          </Grid>
        </Grid>
        {/* </Grid> */}
      </Container>
    </Box>
  );
};

export default AdminDashBoard;
