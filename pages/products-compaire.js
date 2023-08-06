import React from "react";
import ProductsCompaire from "../src/components/ProductsCompaire/index";
import PageHead from "../src/components/Helpers/PageHead";
import Layout from "../src/components/Partials/Layout";
function productsCompairePage() {
  return (
    <>
      <PageHead title="Product Compaire" />
      <Layout childrenClasses="pt-0 pb-0">
        <ProductsCompaire />
      </Layout>
    </>
  );
}
export default productsCompairePage;
