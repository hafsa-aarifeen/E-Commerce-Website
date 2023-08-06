import PageHead from "../src/components/Helpers/PageHead";
import Home from "./../src/components/Home/index";

export default function HomePage({ data }) {
  const { seoSetting } = data;
  return (
    <>

      <PageHead
        title={`${seoSetting.seo_title}`}
        metaDes={seoSetting.seo_description}
      />
      <Home homepageData={data} />
    </>
  );
}
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/`);
  const data = await res.json();
  return { props: { data } };
}
