import React from "react";
import PageHead from "../src/components/Helpers/PageHead";
import PrivacyPolicy from "./../src/components/PrivacyPolicy/index";

export default function PrivacyPolicyPage({ data }) {
  return (
    <>
      <PageHead title="Privacy Policy" />
      <PrivacyPolicy datas={data} />
    </>
  );
}
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/privacy-policy`
  );
  const data = await res.json();
  return { props: { data } };
}
