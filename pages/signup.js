import React from "react";
import Signup from "../src/components/Auth/Signup/index";
import PageHead from "../src/components/Helpers/PageHead";
export default function signupPage() {
  return (
    <>
      <PageHead title="shopo | signup" />
      <Signup />
    </>
  );
}
