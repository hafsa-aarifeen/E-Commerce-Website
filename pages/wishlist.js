import React from "react";
import Wishlist from "./../src/components/Wishlist/index";
import PageHead from "../src/components/Helpers/PageHead";
import Layout from "../src/components/Partials/Layout";
function wishlist() {
  return (
    <>
      <PageHead title="Wishlist" />
      <Layout>
        <Wishlist />
      </Layout>
    </>
  );
}
export default wishlist;
