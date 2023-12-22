import Typography from "@mui/material/Typography";
import Title from "./Title";
import { useEffect, useState } from "react";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function NewUsers({ newUsers }: { newUsers: number }) {
  // const [totalUsers, setTotalUsers] = useState<number>(0);

  // useEffect(() => {
  //   if (newUsers) setTotalUsers(newUsers);
  // }, [newUsers]);

  return (
    <>
      <Title>
        <div className="text-secondary-color flex items-center justify-center gap-x-1">
          <SupervisorAccountIcon sx={{ fontSize: "1.5rem" }} /> Tổng số người
          dùng
        </div>
      </Title>
      <Typography component="p" variant="h5">
        <span>{newUsers} người</span>
      </Typography>
      <div>
        {/* <Link color="primary" href="#" onClick={preventDefault}>
          Biểu đồ doanh thu
        </Link> */}
      </div>
    </>
  );
}
