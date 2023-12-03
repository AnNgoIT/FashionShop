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
import { ReactNode, useContext, useState } from "react";
import { logout } from "@/hooks/useAuth";
import { deleteCookie, getCookies } from "cookies-next";
import { cookies } from "next/headers";
import router from "next/router";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserContext } from "@/store";

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
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    try {
      const cookies = getCookies();
      const id = toast.loading("Wating...");
      const res = await logout(cookies.accessToken!, cookies.refreshToken!);
      if (res.success) {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        toast.update(id, {
          render: `Logout Success`,
          type: "success",
          autoClose: 1000,
          isLoading: false,
        });
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
        router.push("/");
      } else {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        toast.update(id, {
          render: `Please Login!`,
          type: "warning",
          autoClose: 1000,
          isLoading: false,
        });
        router.push("/login");
      }
    } catch (error) {
    } finally {
      setUser({
        fullname: null,
        email: "",
        phone: "",
        dob: null,
        gender: null,
        address: null,
        avatar: "",
        ewallet: 0,
        role: "GUEST",
      });
      router.push("/login");
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
            <Typography
              component="p"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1, textTransform: "capitalize" }}
            >
              {title}
            </Typography>
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
              Logout
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