import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Blog from "../../src/components/Blogs/Blog/index.jsx";
import PageHead from "../../src/components/Helpers/PageHead";

const Blogpage = ({ data }) => {
  const router = useRouter();
  useEffect(() => {
    if (router && !router.query.slug) {
      router.push("*");
    }
  });
  return (
    <>
      <PageHead title="shopo | blogs/blog" />
      {router.query.slug && <Blog details={data} />}
    </>
  );
};
export const getServerSideProps = async (context) => {
  if (context && context.query.slug) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/blog/${context.query.slug}`
    );
    const data = await res.json();
    return {
      props: {
        data,
      },
    };
  } else {
    return {
      props: {
        data: {},
      },
    };
  }
};
export default Blogpage;
