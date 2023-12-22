import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import { FormatPrice } from "@/features/product/FilterAmount";
import { useEffect, useState } from "react";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

export default function Revenue({
  revenues,
  title,
}: {
  revenues: number;
  title: string;
}) {
  const [totalRevenues, setTotalRevenues] = useState<number>(0);

  useEffect(() => {
    if (revenues) setTotalRevenues(revenues);
  }, [revenues]);

  return (
    <>
      <Title>
        <div className="text-primary-color flex items-center justify-center gap-x-1">
          <MonetizationOnIcon sx={{ fontSize: "1.5rem" }} /> {title}
        </div>
      </Title>
      <Typography component="p" variant="h5">
        <span>{FormatPrice(revenues)} VNĐ</span>
      </Typography>
      <div>
        {/* <Link color="primary" href="#" onClick={preventDefault}>
          Biểu đồ doanh thu
        </Link> */}
      </div>
    </>
  );
}
