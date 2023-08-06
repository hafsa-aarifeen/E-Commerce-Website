import React from "react";
import CheakoutPage from "./../src/components/CheakoutPage/index";
import PageHead from "../src/components/Helpers/PageHead";
import Layout from "../src/components/Partials/Layout";

function checkout() {
  return (
    <>
      <PageHead title="Checkout" />
      <Layout childrenClasses="pt-0 pb-0">
        <CheakoutPage />
      </Layout>
    </>
  );
}
export default checkout;
