"use client";
import { Chart, NewUsersChart } from "@/components/dashboard/Chart";
import { decodeToken } from "@/features/jwt-decode";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
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
type DashBoardProps = {
  token?: { accessToken?: string; refreshToken?: string };
  revenues: number;
  newUsers: number;
};

type staticticsFilter = {
  day: number | string;
  month: number | string;
  year: number | string;
};
const AdminDashBoard = (props: DashBoardProps) => {
  const [filterValue, setFilterValue] = useState<staticticsFilter>({
    day: "Chọn",
    month: "Chọn",
    year: "Chọn",
  });

  const { token, revenues, newUsers } = props;

  const [totalRevenues, setTotalRevenues] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    if (revenues && newUsers) {
      setTotalRevenues(revenues);
      setTotalUsers(newUsers);
    }
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
    } else if (!token) {
      deleteCookie("refreshToken");
    }
  }, [newUsers, revenues, token]);

  const handleFilter = async (e: any) => {
    const value = e.target.value;
    setFilterValue({
      ...filterValue,
      [e.target.name]: value,
    });

    let day =
        e.target.name == "day"
          ? "&day=" + value
          : filterValue.day !== "Chọn"
          ? "&day=" + filterValue.day
          : "&day=" + new Date().getDate(),
      month =
        e.target.name == "month"
          ? "&month=" + value
          : filterValue.month !== "Chọn"
          ? "&month=" + filterValue.month
          : "&month=" + new Date().getUTCMonth() + 1,
      year =
        e.target.name == "year"
          ? "year=" + value
          : filterValue.year !== "Chọn"
          ? "year=" + filterValue?.year
          : "year=" + new Date().getFullYear();

    if (e.target.name === "day" && value != "Chọn") {
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
      setTotalRevenues(revenueRes?.success ? revenueRes.result : 0);
      setTotalUsers(userRes?.success ? userRes.result : 0);
    } else if (e.target.name === "month" && value != "Chọn") {
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
      setTotalRevenues(revenueRes?.success ? revenueRes.result : 0);
      setTotalUsers(userRes?.success ? userRes.result : 0);
    } else if (e.target.name === "year" && value != "Chọn") {
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
      setTotalRevenues(revenueRes?.success ? revenueRes.result : 0);
      setTotalUsers(userRes?.success ? userRes.result : 0);
    }
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
          <Grid item xs={12} md={4} lg={5}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "fit-content",
              }}
            >
              <div className="w-full flex items-center gap-x-1 text-xl font-bold p-2 border-b border-border-color">
                <FilterAltIcon sx={{ fontSize: "32px" }} />
                Lọc theo
              </div>
              <div className="p-2">
                <FormControl fullWidth>
                  <InputLabel id="year-filter-label">Năm</InputLabel>
                  <Select
                    name="year"
                    labelId="year-filter-label"
                    id="year-filtering"
                    value={filterValue?.year || "Chọn"}
                    label="Năm"
                    onChange={handleFilter}
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
              <div className="p-2">
                <FormControl fullWidth>
                  <InputLabel id="month-filter-label">Tháng</InputLabel>
                  <Select
                    name="month"
                    labelId="month-filter-label"
                    id="month-filtering"
                    value={filterValue?.month || "Chọn"}
                    label="Tháng"
                    onChange={handleFilter}
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
              <div className="p-2">
                <FormControl fullWidth>
                  <InputLabel id="day-filter-label">Ngày</InputLabel>
                  <Select
                    name="day"
                    labelId="day-filter-label"
                    id="day-filtering"
                    value={filterValue?.day || "Chọn"}
                    label="Ngày"
                    onChange={handleFilter}
                  >
                    <MenuItem value={"Chọn"}>Chọn</MenuItem>
                    {Array.from(Array(new Date().getDate()).keys())
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
              </div>{" "}
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
          <Grid container xs={7} item>
            <Grid height={"fit-content"} item xs={12}>
              <span className="text-lg font-bold">Tổng quan</span>
            </Grid>
            <Grid item xs={12} md={4} lg={6}>
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
                <Revenue revenues={totalRevenues} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={6}>
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
                <NewUsers newUsers={totalUsers} />
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid height={"fit-content"} item xs={12}>
              <span className="text-lg font-bold">Biểu đồ thống kê</span>
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashBoard;
