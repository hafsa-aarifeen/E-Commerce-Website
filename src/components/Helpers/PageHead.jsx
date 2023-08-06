import Head from "next/head";
import React from "react";
import settings from "../../../utils/settings";
function PageHead(props) {
  const { title } = props;
  const { favicon } = settings();
  const { metaDes } = props;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={metaDes} />
      <link
        rel="icon"
        href={`${
          favicon ? process.env.NEXT_PUBLIC_BASE_URL + favicon : "/favico.svg"
        }`}
      />
    </Head>
  );
}

export default PageHead;
