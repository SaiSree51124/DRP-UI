import React from "react";
import { IconButton } from "@mui/material";

const UserProfile = () => {
  return (
    <IconButton color="inherit" sx={{ marginLeft: 2 }}>
      <img
        src="/authbtn.png"
        alt="User Profile"
        style={{ width: 32, height: 32, borderRadius: "50%" }}
      />
    </IconButton>
  );
};

export default UserProfile;
