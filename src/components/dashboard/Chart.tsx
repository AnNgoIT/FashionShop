import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Sector,
  Cell,
} from "recharts";
import Title from "./Title";
import { useEffect, useState } from "react";
import { getAuthenticated } from "@/hooks/useData";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";

function Chart() {
  const theme = useTheme();
  const [data, setData] = useState<any[]>([]);

  async function revenue7latestDays() {
    let array: any[] = [];
    try {
      await Promise.all(
        Array.from({ length: 7 }, (_, i) =>
          getAuthenticated(
            `/api/v1/users/admin/statistics/revenue-days?year=${new Date().getFullYear()}&month=${
              new Date().getMonth() + 1
            }&day=${new Date().getDate() - i}`,
            getCookie("accessToken")!
          ).then((getData) => {
            const newData = createData(
              `${new Date().getDate() - i}/${
                new Date().getMonth() + 1
              }/${new Date().getFullYear()}`,
              getData?.success ? getData.result : 0
            );
            array.push(newData);
          })
        )
      );
      // Sắp xếp mảng array theo ngày từ thấp đến cao
      array.sort((a, b) => {
        const dateA = new Date(a.ngay.split("/").reverse().join("/")).getDate();
        const dateB = new Date(b.ngay.split("/").reverse().join("/")).getDate();
        return dateA - dateB;
      });
      return array;
    } catch (error) {
      return [];
    }
  }

  // Inside your component
  useEffect(() => {
    async function fetchData() {
      const data = await revenue7latestDays();
      setData(
        data.sort(
          (a, b) => dayjs(b.time).get("date") - dayjs(a.time).get("date")
        )
      );
    }
    fetchData();
  }, []);

  return (
    <>
      <Title>Doanh thu 7 ngày gần nhất</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="ngay"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
                // transform: "translateX(10px)",
              }}
            >
              VNĐ
            </Label>
          </YAxis>
          <Tooltip />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="doanhthu"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

function NewUsersChart() {
  const theme = useTheme();
  const [data, setData] = useState<any[]>([]);

  async function newUserslatestDays() {
    let array: any[] = [];
    try {
      await Promise.all(
        Array.from({ length: 5 }, (_, i) =>
          getAuthenticated(
            `/api/v1/users/admin/statistics/new-users?year=${new Date().getFullYear()}&month=${
              new Date().getMonth() + 1
            }&day=${new Date().getDate() - i}`,
            getCookie("accessToken")!
          ).then((getData) => {
            const newData = createUserData(
              `${new Date().getDate() - i}/${
                new Date().getMonth() + 1
              }/${new Date().getFullYear()}`,
              getData?.success ? getData.result : 0
            );
            array.push(newData);
          })
        )
      );
      // Sắp xếp mảng array theo ngày từ thấp đến cao
      array.sort((a, b) => {
        const dateA = new Date(a.ngay.split("/").reverse().join("/")).getDate();
        const dateB = new Date(b.ngay.split("/").reverse().join("/")).getDate();
        return dateA - dateB;
      });
      return array;
    } catch (error) {
      return [];
    }
  }

  // Inside your component
  useEffect(() => {
    async function fetchData() {
      const data = await newUserslatestDays();
      setData(
        data.sort(
          (a, b) => dayjs(b.time).get("date") - dayjs(a.time).get("date")
        )
      );
    }
    fetchData();
  }, []);

  return (
    <>
      <Title>Số lượng người dùng 7 ngày gần nhất</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="ngay"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Số lượng (Người)
            </Label>
          </YAxis>
          <Tooltip />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="soluong"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export { Chart, NewUsersChart };
function createData(ngay: string, doanhthu: number) {
  return { ngay, doanhthu };
}
function createUserData(ngay: string, soluong: number) {
  return { ngay, soluong };
}
