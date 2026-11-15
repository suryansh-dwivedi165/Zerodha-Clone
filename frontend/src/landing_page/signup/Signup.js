import React from "react";
import AccountForm from "../AccountForm";
import LeftSection from "./LeftSection";

function Signup() {
  return (
    <>
      <AccountForm mode="register" />
      <LeftSection/>
    </>
  );
}

export default Signup; 
