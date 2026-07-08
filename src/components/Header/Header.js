import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import { GRAD } from "../../utils/colors";
import Logo from "./Logo";
import Navigation from "./Navigation";
import UserProfile from "./UserProfile";

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        background: GRAD,
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ paddingLeft: "10px !important", paddingRight: "10px !important" }}>
        <Logo />
        <Navigation />
        <UserProfile />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
