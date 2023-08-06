import React from "react";
import Blogs from "../../src/components/Blogs/index";
import PageHead from "../../src/components/Helpers/PageHead";
export default function BlogsPage({ data }) {
  const { seoSetting } = data;
  return (
    <>
      <PageHead
        title={`${seoSetting.seo_title}`}
        metaDes={seoSetting.seo_description}
      />
      <Blogs blogs={data.blogs.data} nextPageUrl={data.blogs.next_page_url} />
    </>
  );
}
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/blog`);
  const data = await res.json();
  return { props: { data } };
}
