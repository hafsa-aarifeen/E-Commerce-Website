import React from "react";
import BecomeSaller from "../src/components/BecomeSaller/index";
import PageHead from "../src/components/Helpers/PageHead";
import Layout from "../src/components/Partials/Layout";
function BecomeSallerPage() {
  return (
    <>
      <PageHead title="Become saller" />
      <Layout childrenClasses="pt-0 pb-0">
        <BecomeSaller />
      </Layout>
    </>
  );
}
export default BecomeSallerPage;
