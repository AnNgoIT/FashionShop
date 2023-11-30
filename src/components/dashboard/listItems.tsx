import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import LayersIcon from "@mui/icons-material/Layers";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import StyleIcon from "@mui/icons-material/Style";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import Link from "next/link";

export const mainListItems = (
  <>
    <Link href="/admin">
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </Link>
    <Link href="/admin/orders">
      <ListItemButton>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItemButton>
    </Link>
    <Link href="/admin/users">
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItemButton>
    </Link>
    <Link href="/admin/products">
      <ListItemButton>
        <ListItemIcon>
          <InventoryIcon />
        </ListItemIcon>
        <ListItemText primary="Products" />
      </ListItemButton>
    </Link>
    <Link href="/admin/products/items">
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Products Item" />
      </ListItemButton>
    </Link>
    <Link href="/admin/categories">
      <ListItemButton>
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary="Categories" />
      </ListItemButton>
    </Link>
    <Link href="/admin/brands">
      <ListItemButton>
        <ListItemIcon>
          <BrandingWatermarkIcon />
        </ListItemIcon>
        <ListItemText primary="Brands" />
      </ListItemButton>
    </Link>
    <Link href="/admin/styles">
      <ListItemButton>
        <ListItemIcon>
          <StyleIcon />
        </ListItemIcon>
        <ListItemText primary="Styles" />
      </ListItemButton>
    </Link>
    <Link href="/admin/styleValues">
      <ListItemButton>
        <ListItemIcon>
          <FormatPaintIcon />
        </ListItemIcon>
        <ListItemText primary="Style Values" />
      </ListItemButton>
    </Link>
  </>
);
