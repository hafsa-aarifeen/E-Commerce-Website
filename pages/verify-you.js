import React from "react";
import Signup from "../src/components/Auth/Signup";
import PageHead from "../src/components/Helpers/PageHead";

export default function verifyYou() {
  return (
    <>
      <PageHead title="Verify" />
      <Signup />
    </>
  );
}
