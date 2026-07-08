import React from "react";
import { Typography } from "@mui/material";
import { C } from "../../utils/colors";

const Logo = () => {
  return (
    <>
      <img
        src="/logo.png"
        alt="Logo"
        style={{ width: 40, height: 40, marginRight: 10 }}
      />
      <Typography
        variant="div"
        sx={{
          flexGrow: 1,
          fontWeight: 700,
          fontSize: "25px",
          lineHeight: "100%",
          letterSpacing: "0%",
          verticalAlign: "middle",
          color: C.card,
        }}
      >
        Drug Repurposing Platform
      </Typography>
    </>
  );
};

export default Logo;
