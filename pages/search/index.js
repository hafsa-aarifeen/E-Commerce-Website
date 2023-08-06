import React from "react";
import AllProductPage from "../../src/components/AllProductPage/index";
import PageHead from "../../src/components/Helpers/PageHead";

export default function allproductsPage(data) {
  return (
    <>
      <PageHead title="search | products" />
      <AllProductPage response={data} />
    </>
  );
}
export const getServerSideProps = async (context) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/product?${
      context.query.search
        ? `search=${context.query.search}`
        : context.query.category && context.query.search
        ? `search=${context.query.search}&categories[]=${context.query.category}`
        : `search=${context.query.search}`
    }`
  );
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
};
