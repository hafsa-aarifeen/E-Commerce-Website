import ProductCardStyleOneTwo from "./Cards/ProductCardStyleOneTwo";
import DataIteration from "./DataIteration";
import ViewMoreTitle from "./ViewMoreTitle";

export default function SectionStyleThreeHomeTwo({
  className,
  sectionTitle,
  seeMoreUrl,
  products = [],
  showProducts,
}) {
  const rs = products.map((item) => {
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
    <>
      <div className={`section-style-one ${className || ""}`}>
        <ViewMoreTitle categoryTitle={sectionTitle} seeMoreUrl={seeMoreUrl}>
          <div className="products-section w-full">
            <div className="grid  lg:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-10">
              <DataIteration
                datas={rs}
                startLength={0}
                endLength={showProducts}
              >
                {({ datas }) => (
                  <div data-aos="fade-up" key={datas.id} className="item">
                    <ProductCardStyleOneTwo datas={datas} />
                  </div>
                )}
              </DataIteration>
            </div>
          </div>
        </ViewMoreTitle>
      </div>
    </>
  );
}
