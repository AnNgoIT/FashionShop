"use client";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems } from "./listItems";
import { ReactNode, useEffect, useState } from "react";
import { logout } from "@/hooks/useAuth";
import { deleteCookie, getCookies } from "cookies-next";
import { useRouter } from "next/navigation";
import { successMessage } from "@/features/toasting";
import Avatar from "@mui/material/Avatar";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard({
  children,
}: // title,
{
  children: ReactNode;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    const cookies = getCookies();
    const res = await logout(cookies.accessToken!, cookies.refreshToken!);
    if (res.success) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      successMessage("Đăng xuất thành công");
      // Refresh the current route and fetch new data from the server without
      // losing client-side browser or React state.
      router.refresh();
      router.push("/");
    } else if (res.statusCode == 401) {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} sx={{ background: "#639df1" }}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <div className="flex items-center gap-x-2">
              <Avatar alt="Admin">Ad</Avatar>
              <p>Admin</p>
            </div>
            <Typography
              onClick={handleLogout}
              component="button"
              color="inherit"
              noWrap
              sx={{
                flexGrow: 0,
                textTransform: "capitalize",
                fontSize: "1.25rem",
                "&:hover": {
                  opacity: 0.6,
                  cursor: "pointer",
                },
              }}
            >
              Đăng xuất
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">{mainListItems}</List>
        </Drawer>
        {children}
      </Box>
    </ThemeProvider>
  );
}
