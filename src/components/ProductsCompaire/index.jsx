import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import isAuth from "../../../Middleware/isAuth";
import apiRequest from "../../../utils/apiRequest";
import auth from "../../../utils/auth";
import { fetchCompareProducts } from "../../store/compareProduct";
import Star from "../Helpers/icons/Star";
import PageTitle from "../Helpers/PageTitle";
import CheckProductIsExistsInFlashSale from "../Shared/CheckProductIsExistsInFlashSale";
import ServeLangItem from "../Helpers/ServeLangItem";
function ProductsCompaire() {
  const dispatch = useDispatch();
  const [compareProducts, setProducts] = useState(null);
  const [imagesRow, setImagesRow] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [stocks, setStocks] = useState([]);
  const fetchProducts = () => {
    if (auth()) {
      apiRequest
        .compare(auth().access_token)
        .then((res) => {
          res.data && setProducts(res.data.products);
          const getImages =
            res.data &&
            res.data.products.length > 0 &&
            res.data.products
              .slice(
                0,
                res.data.products.length >= 4 ? 4 : res.data.products.length
              )
              .map((item) => {
                return {
                  id: item.id,
                  price: parseInt(item.price),
                  offerPrice: item.offer_price
                    ? parseInt(item.offer_price)
                    : null,
                  image: item.thumb_image,
                  name: item.short_name,
                  variants: item.active_variants,
                };
              });
          setImagesRow(getImages);
          const getRatings =
            res.data &&
            res.data.products.length > 0 &&
            res.data.products
              .slice(
                0,
                res.data.products.length >= 4 ? 4 : res.data.products.length
              )
              .map((item) => {
                return parseInt(item.averageRating);
              });
          setRatings(getRatings);
          const getStocks =
            res.data &&
            res.data.products.length > 0 &&
            res.data.products
              .slice(
                0,
                res.data.products.length >= 4 ? 4 : res.data.products.length
              )
              .map((item) => {
                return parseInt(item.qty);
              });
          setStocks(getStocks);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    if (!compareProducts) {
      fetchProducts();
    }
  }, [compareProducts]);

  const removeItem = (id) => {
    if (auth()) {
      apiRequest
        .removeCompareItem(id, auth().access_token)
        .then((res) => {
          toast.success(res.data && res.data.notification);
          fetchProducts();
          dispatch(fetchCompareProducts());
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const price = (item) => {

    if (item) {
      const prices =
        item.variants &&
        item.variants.length > 0 &&
        item.variants.map((item) =>
          item.active_variant_items.length > 0
            ? parseInt(item.active_variant_items[0].price)
            : 0
        );
      const sumVarient = prices.length > 0 ? prices.reduce((p, c) => p + c) : 0;
      if (item.offerPrice) {
        if (prices) {
          return parseInt(item.offerPrice) + sumVarient;
        } else {
          return parseInt(item.offerPrice);
        }
      } else {
        if (item.variants && item.variants.length > 0) {
          return parseInt(item.price) + sumVarient;
        } else {
          return item.price;
        }
      }
    }
  };

  return (
    <div className="products-compaire-wrapper w-full bg-white pb-[40px]">
      <div className="w-full mb-5">
        <PageTitle
          breadcrumb={[
            { name: ServeLangItem()?.home, path: "/" },
            { name: ServeLangItem()?.Product_Compaire, path: "/index.js-compaire" },
          ]}
          title="Product Comparison"
        />
      </div>
      <div className="container-x mx-auto">
        {compareProducts && compareProducts.length > 0 ? (
          <div className="w-full border border-qgray-border overflow-x-auto">
            <table className="table-wrapper w-full">
              <tbody>
                {/*image*/}
                <tr className="table-row-wrapper">
                  <td
                    className="pt-[30px] px-[26px] align-top bg-[#FAFAFA]"
                    style={{
                      width: `calc(100% / ${
                        compareProducts.length >= 4
                          ? 4 + 1
                          : compareProducts.length + 1
                      })`,
                    }}
                  >
                    <div className="">
                      <h1 className="text-[18px] font-medium text-qblack mb-4">
                          {ServeLangItem()?.Product_Comparison}
                      </h1>
                      <p className="text-[13px] text-qgraytwo">
                          {ServeLangItem()?.Select_products_to_see_the_differences_and_similarities_between_them}
                      </p>
                    </div>
                  </td>
                  {imagesRow &&
                    imagesRow.length > 0 &&
                    imagesRow.map((item, i) => (
                      <td
                        key={i}
                        className="product bg-white p-6 border-b border-r border-qgray-border relative"
                        style={{
                          width: `calc(100% / ${
                            compareProducts.length >= 4
                              ? 4 + 1
                              : compareProducts.length + 1
                          })`,
                        }}
                      >
                        {/*<div className="w-full mb-[30px]">*/}
                        {/*  <div className="w-full h-[44px]">*/}
                        {/*    <InputCom*/}
                        {/*        type="text"*/}
                        {/*        placeholder="Search Product..."*/}
                        {/*        inputClasses="w-full h-full px-2"*/}
                        {/*    >*/}
                        {/*      <div*/}
                        {/*          className="absolute right-2 z-10 bg-white"*/}
                        {/*          style={{ top: "calc(100% - 28px)" }}*/}
                        {/*      >*/}
                        {/*        <svg*/}
                        {/*            width="17"*/}
                        {/*            height="17"*/}
                        {/*            viewBox="0 0 17 17"*/}
                        {/*            fill="none"*/}
                        {/*            xmlns="http://www.w3.org/2000/svg"*/}
                        {/*        >*/}
                        {/*          <path*/}
                        {/*              fillRule="evenodd"*/}
                        {/*              clipRule="evenodd"*/}
                        {/*              d="M11.0821 12.2955C10.0273 13.0961 8.71195 13.5712 7.2856 13.5712C3.81416 13.5712 1 10.757 1 7.2856C1 3.81416 3.81416 1 7.2856 1C10.757 1 13.5712 3.81416 13.5712 7.2856C13.5712 8.97024 12.9085 10.5001 11.8295 11.6286L11.6368 11.436L10.9297 12.1431L11.0821 12.2955ZM11.795 13.0084C10.5546 13.9871 8.98829 14.5712 7.2856 14.5712C3.26187 14.5712 0 11.3093 0 7.2856C0 3.26187 3.26187 0 7.2856 0C11.3093 0 14.5712 3.26187 14.5712 7.2856C14.5712 9.24638 13.7966 11.0263 12.5367 12.3359L16.4939 16.293L15.7868 17.0001L11.795 13.0084Z"*/}
                        {/*              fill="#181B31"*/}
                        {/*          />*/}
                        {/*        </svg>*/}
                        {/*      </div>*/}
                        {/*    </InputCom>*/}
                        {/*  </div>*/}
                        {/*</div>*/}
                        <div className="product-img flex justify-center mb-3 ">
                          <div className="w-[161px] h-[161px] relative">
                            <Image
                              layout="fill"
                              objectFit="scale-down"
                              src={`${
                                process.env.NEXT_PUBLIC_BASE_URL + item.image
                              }`}
                              alt=""
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                        <p className="text-center text-[15px] font-medium text-qblack leading-[24px] mb-2">
                          {item.name}
                        </p>
                        <p className="text-center text-[15px] font-medium text-qred leading-[24px]">
                          <span>
                            {
                              <CheckProductIsExistsInFlashSale
                                id={item.id}
                                price={price(item)}
                              />
                            }
                          </span>
                        </p>
                        <div className="absolute right-2.5 top-2.5">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                          >
                            <span className="text-red-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </span>
                          </button>
                        </div>
                      </td>
                    ))}
                </tr>
                {/*rating*/}
                <tr className="table-row-wrapper">
                  <td
                    className="w-[233px]  px-[26px] align-top bg-[#FAFAFA]"
                    style={{
                      width: `calc(100% / ${
                        compareProducts.length >= 4
                          ? 4 + 1
                          : compareProducts.length + 1
                      })`,
                    }}
                  >
                    <div className="">
                      <h1 className="text-[15px] font-medium text-qblack ">
                          {ServeLangItem()?.Star_Rating}
                      </h1>
                    </div>
                  </td>
                  {ratings.map((item, i) => (
                    <td
                      key={i}
                      style={{
                        width: `calc(100% / ${
                          compareProducts.length >= 4
                            ? 4 + 1
                            : compareProducts.length + 1
                        })`,
                      }}
                      className="product bg-white px-6 border-r border-qgray-border pb-[20px] align-top"
                    >
                      <div className="flex space-x-2 items-center">
                        {Array.from(Array(item), () => (
                          <span key={item + Math.random()}>
                            <Star />
                          </span>
                        ))}
                        {item < 5 && (
                          <>
                            {Array.from(Array(5 - item), () => (
                              <span
                                key={item + Math.random()}
                                className="text-gray-500"
                              >
                                <Star defaultValue={false} />
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
                {/*Availability*/}
                <tr className="table-row-wrapper">
                  <td
                    className=" px-[26px] align-top bg-[#FAFAFA]"
                    style={{
                      width: `calc(100% / ${
                        compareProducts.length >= 4
                          ? 4 + 1
                          : compareProducts.length + 1
                      })`,
                    }}
                  >
                    <div className="">
                      <h1 className="text-[15px] font-medium text-qblack ">
                          {ServeLangItem()?.Availability}
                      </h1>
                    </div>
                  </td>
                  {stocks &&
                    stocks.length > 0 &&
                    stocks.map((item, i) => (
                      <td
                        key={i}
                        style={{
                          width: `calc(100% / ${
                            compareProducts.length >= 4
                              ? 4 + 1
                              : compareProducts.length + 1
                          })`,
                        }}
                        className="product bg-white px-6 border-r border-qgray-border pb-[20px] align-top"
                      >
                        {item !== 0 ? (
                          <span className="text-[13px] font-semibold text-green-500">
                            {ServeLangItem()?.In_Stock}
                          </span>
                        ) : (
                          <span className="text-[13px] font-semibold text-red-500">
                            {ServeLangItem()?.Out_of_Stock}
                          </span>
                        )}
                      </td>
                    ))}
                </tr>
                <tr className="table-row-wrapper">
                  <td
                    className=" px-[26px] align-top bg-[#FAFAFA]"
                    style={{
                      width: `calc(100% / ${
                        compareProducts.length >= 4
                          ? 4 + 1
                          : compareProducts.length + 1
                      })`,
                    }}
                  >
                    <div className="">
                      <h1 className="text-[15px] font-medium text-qblack ">
                          {ServeLangItem()?.Specification}
                      </h1>
                    </div>
                  </td>
                  {compareProducts
                    .slice(
                      0,
                      compareProducts.length >= 4 ? 4 : compareProducts.length
                    )
                    .map((item, i) => (
                      <td
                        key={i}
                        style={{
                          width: `calc(100% / ${
                            compareProducts.length >= 4
                              ? 4 + 1
                              : compareProducts.length + 1
                          })`,
                        }}
                        className="product bg-white px-6 border-r border-qgray-border pb-[20px] align-top"
                      >
                          {item.specifications.length > 0 ? (
                              item.specifications.map((sp, i) => (
                                  <ul key={i}>
                                      <li className="mb-2">
                                          <p className="text-qblack text-sm font-semibold">
                                              {sp.key.key}
                                          </p>
                                          <span className="text-[13px] font-normal text-qgraytwo">
                                  {sp.specification}
                                </span>
                                      </li>
                                  </ul>
                              ))
                          ) : (
                              <span className="text-[13px] font-normal text-qgraytwo">
                            N/A
                          </span>
                          )}
                      </td>
                    ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full h-96 flex justify-center items-center border border-qgray-border">
            <div>
              <p className="text-xl text-qblack ">{ServeLangItem()?.Your_Compare_List_Is_Empty}</p>
              <Link href="/">
                <div className="flex justify-center w-full mt-5 cursor-pointer">
                  <div className="w-[180px] h-[50px] ">
                    <span type="button" className="yellow-btn">
                     {ServeLangItem()?.Back_to_Shop}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default isAuth(ProductsCompaire);
