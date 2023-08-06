import ProductCardStyleOne from "../Helpers/Cards/ProductCardStyleOne";
import CountDown from "../Helpers/CountDown";
import DataIteration from "../Helpers/DataIteration";
import Layout from "../Partials/Layout";
import CountDownWidget from "./CountDownWidget";

export default function FlashSale({ fetchData }) {
  const cp =
    fetchData.products &&
    fetchData.products.data.length > 0 &&
    fetchData.products.data.map((item) => {
      return {
        id: item.id,
        category_id: item.category_id,
        title: item.name,
        slug: item.slug,
        image: process.env.NEXT_PUBLIC_BASE_URL + item.thumb_image,
        price: item.price,
        offer_price: item.offer_price,
        campaingn_product: null,
        review: parseInt(item.averageRating),
        variants: item.active_variants ? item.active_variants : [],
      };
    });
  return (
    <Layout>
      <div className="flashsale-wrapper w-full">
        <div className="container-x mx-auto">
          <div className="w-full">
            <div
              style={{
                backgroundImage: `url(${
                  process.env.NEXT_PUBLIC_BASE_URL +
                  fetchData.flashSale.flashsale_page_image
                })`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
              data-aos="fade-right"
              className="flash-ad w-full h-[400px] flex sm:justify-end justify-center items-center mb-10"
            >
              <CountDownWidget endTime={fetchData.flashSale.end_time} />
            </div>
            <div className="products grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5">
              <DataIteration datas={cp} startLength={0} endLength={cp.length}>
                {({ datas }) => (
                  <div data-aos="fade-up" key={datas.id} className="item">
                    <ProductCardStyleOne datas={datas} />
                  </div>
                )}
              </DataIteration>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
