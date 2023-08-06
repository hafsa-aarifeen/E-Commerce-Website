import React from "react";
import PageHead from "../src/components/Helpers/PageHead";
import TermsCondition from "../src/components/SellerTermsCondition/index";
export default function termsConditionPage({ data }) {
    return (
        <>
            <PageHead title="Terms and Conditions" />
            <TermsCondition datas={data} />
        </>
    );
}
export async function getServerSideProps() {
    // Fetch data from external API
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/seller-terms-conditoins`
    );
    const data = await res.json();
    return { props: { data } };
}
