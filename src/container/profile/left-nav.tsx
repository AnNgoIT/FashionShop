"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import PasswordIcon from "@mui/icons-material/Password";
import HistoryIcon from "@mui/icons-material/History";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Link from "next/link";
import { user_img2 } from "@/assests/users";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import Avatar from "@mui/material/Avatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 499,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1250,
    },
  },
});
const ProfileNav = () => {
  return (
    <div className="col-span-full sm:col-span-10 sm:col-start-2 xl:col-span-2 xl:col-start-2 lg:col-span-3">
      <ThemeProvider theme={theme}>
        <List
          sx={{
            width: "100%",
            display: {
              xs: "grid",
              lg: "block",
            },
            gridAutoFlow: "column",
            paddingBottom: "0px",
            // bgcolor: "black",
          }}
          className="grid grid-cols-4 grid-flow-col max-lg:place-content-between"
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader
              sx={{
                bgcolor: "transparent",
                display: {
                  // xs: "none",
                  lg: "block",
                },
                position: "relative!important",
                padding: {
                  xs: "0px",
                  lg: "0px 6px 16px 16px",
                },
              }}
              component="div"
              id="nested-list-subheader"
              className="col-span-1 lg:col-span-full"
            >
              <Link
                className="flex  max-lg:justify-center items-center gap-x-2 h-full"
                href={"/profile"}
              >
                <Avatar alt="avatar" src={user_img2.src}>
                  T
                </Avatar>
                <span className="lowercase text-text-color text-sm max-lg:hidden">
                  thangnguyen138
                </span>
              </Link>
            </ListSubheader>
          }
        >
          <Link className="col-span-1 lg:col-span-full" href="/profile/address">
            <ListItemButton
              sx={{
                color: "black",
                padding: "16px 6px!important",
                "&:hover": {
                  color: "#639df1",
                },
                display: {
                  xs: "flex",
                },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ListItemIcon>
                <AddLocationIcon sx={{ minWidth: "3rem" }} />
              </ListItemIcon>
              <ListItemText
                sx={{
                  display: {
                    xs: "none",
                    lg: "block",
                  },
                }}
                primary="Address"
              />
            </ListItemButton>
          </Link>
          <Link
            className="col-span-1 lg:col-span-full"
            href="/profile/change-password"
          >
            <ListItemButton
              sx={{
                color: "black",
                padding: "16px 6px!important",
                "&:hover": {
                  color: "#639df1",
                },
                // minWidth: "max-content",
                display: {
                  xs: "flex",
                },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ListItemIcon>
                <PasswordIcon sx={{ minWidth: "3rem" }} />
              </ListItemIcon>
              <ListItemText
                sx={{
                  display: {
                    xs: "none",
                    lg: "block",
                  },
                  minWidth: "max-content",
                }}
                primary="Change Password"
              />
            </ListItemButton>
          </Link>
          <Link
            className="col-span-1 lg:col-span-full"
            href="/profile/order-tracking"
          >
            <ListItemButton
              sx={{
                color: "black",
                padding: "16px 6px!important",
                "&:hover": {
                  color: "#639df1",
                },
                display: {
                  xs: "flex",
                },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ListItemIcon>
                <ListAltIcon sx={{ minWidth: "3rem" }} />
              </ListItemIcon>
              <ListItemText
                sx={{
                  display: {
                    xs: "none",
                    lg: "block",
                  },
                }}
                primary="Order Tracking"
              />
            </ListItemButton>
          </Link>
          <Link
            className="col-span-1 lg:col-span-full"
            href="/profile/order-history"
          >
            <ListItemButton
              sx={{
                color: "black",
                padding: "16px 6px!important",
                "&:hover": {
                  color: "#639df1",
                },
                display: {
                  xs: "flex",
                },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ListItemIcon>
                <HistoryIcon sx={{ minWidth: "3rem" }} />
              </ListItemIcon>
              <ListItemText
                sx={{
                  display: {
                    xs: "none",
                    lg: "block",
                  },
                }}
                primary="Order History"
              />
            </ListItemButton>
          </Link>
        </List>
      </ThemeProvider>
    </div>
  );
};

export default ProfileNav;
