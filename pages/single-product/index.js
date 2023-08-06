import { useRouter } from "next/router";
import { useEffect } from "react";
import PageHead from "../../src/components/Helpers/PageHead";
import SingleProductPage from "../../src/components/SingleProductPage";
const SingleProduct = ({ data }) => {
  const router = useRouter();
  useEffect(() => {
    if (router && !router.query.slug) {
      router.push("*");
    }
  });

  return (
    <>
      <PageHead
          title={`${data.product && data.product.seo_title}`}
          metaDes={data.product && data.product.seo_description}
      />
      {router.query.slug && <SingleProductPage details={data} />}
    </>
  );
};
export const getServerSideProps = async (context) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/product/${context.query.slug}`
  );
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
};
export default SingleProduct;
