import React from "react";
import Faq from "../src/components/Faq/index";
import PageHead from "../src/components/Helpers/PageHead";

export default function faqPage({ data }) {
  return (
    <>
      <PageHead title="shopo | FAQ" />
      <Faq datas={data} />
    </>
  );
}
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/faq`);
  const data = await res.json();
  return { props: { data } };
}
