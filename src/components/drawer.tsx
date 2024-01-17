import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { UserContext } from "@/store";
import { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import { user_img2 } from "@/assests/users";
import { deleteCookie, getCookie, getCookies } from "cookies-next";
import { logout } from "@/hooks/useAuth";
import { cookies } from "next/headers";
import router from "next/router";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
type Anchor = "right";

export default function SwipeableTemporaryDrawer() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [state, setState] = React.useState({
    right: false,
  });
  const cookies = getCookies();

  const handleLogout = async () => {
    try {
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

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Link href={user.email !== "" ? "/profile" : "/login"}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ display: "flex", alignItems: "center" }}>
                {user.email !== "" ? (
                  <Avatar
                    alt="avatar"
                    src={user.avatar ? user.avatar : user_img2.src}
                  ></Avatar>
                ) : (
                  <PersonIcon />
                )}
              </ListItemIcon>
              <ListItemText
                primary={user.email !== "" ? user.fullname : "Tài khoản"}
              />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link href="/cart">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary={"Giỏ hàng"} />
            </ListItemButton>
          </ListItem>
        </Link>
        {user.email !== "" && getCookie("accessToken") && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={"Đăng xuất"} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <Button sx={{ color: "white" }} onClick={toggleDrawer("right", true)}>
          <MenuIcon
            sx={{
              fontSize: "30px",
              "&:hover": {
                opacity: "0.6",
                cursor: "pointer",
              },
            }}
          />
        </Button>
        <SwipeableDrawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
          onOpen={toggleDrawer("right", true)}
        >
          {list("right")}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
