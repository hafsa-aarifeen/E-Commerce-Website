import React from "react";
import Contact from "../src/components/Contact/index";
import PageHead from "../src/components/Helpers/PageHead";
export default function contactPage({ data }) {
  const { seoSetting } = data;
  return (
    <>
      <PageHead
        title={`${seoSetting.seo_title}`}
        metaDes={seoSetting.seo_description}
      />
      <Contact datas={data} />
    </>
  );
}
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/contact-us`);
  const data = await res.json();
  return { props: { data } };
}
