import React from "react";
import ForgotPass from "../src/components/Auth/ForgotPass";
import PageHead from "../src/components/Helpers/PageHead";

export default function ForgotPassword() {
  return (
    <>
      <PageHead title="forgot password" />
      <ForgotPass />
    </>
  );
}
