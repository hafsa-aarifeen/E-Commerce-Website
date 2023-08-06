import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import apiRequest from "../../../utils/apiRequest";
import auth from "../../../utils/auth";
import BreadcrumbCom from "../BreadcrumbCom";
import ProductCardStyleOne from "../Helpers/Cards/ProductCardStyleOne";
import DataIteration from "../Helpers/DataIteration";
import InputCom from "../Helpers/InputCom";
import LoaderStyleOne from "../Helpers/Loaders/LoaderStyleOne";
import Layout from "../Partials/Layout";
import Multivendor from "../Shared/Multivendor";
import ProductView from "./ProductView";
import Reviews from "./Reviews";
import SallerInfo from "./SallerInfo";
import ServeLangItem from "../Helpers/ServeLangItem";

export default function SingleProductPage({ details }) {
  const router = useRouter();
  const [tab, setTab] = useState("des");
  const reviewElement = useRef(null);
  const [report, setReport] = useState(false);
  const ReportHandler =()=>{
    if(auth()){
      setReport(!report);
    }else{
      router.push("/login")
    }
  };
  const [reportLoading, setReportLoading] = useState(false);
  //report state
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [reportErrors, setReportErrors] = useState(null);
  const [commnets, setComments] = useState(null);
  useEffect(() => {
    if (!commnets) {
      const reviews =
        details &&
        details.productReviews.length > 0 &&
        details.productReviews.map((review) => {
          return {
            id: review.id,
            author: review.user.name,
            comments: review.review,
            review: parseInt(review.rating),
            replys: null,
            image: review.user.image
              ? process.env.NEXT_PUBLIC_BASE_URL + review.user.image
              : null,
          };
        });
      setComments(reviews);
    }
  }, [commnets]);

  const sellerInfo = details.seller
    ? {
        seller: {
          ...details.seller,
          sellerTotalProducts: parseInt(details.sellerTotalProducts),
          sellerTotalReview: parseInt(details.sellerTotalReview),
        },
      }
    : null;
  const relatedProducts = details.relatedProducts.map((item) => {
    return {
      id: item.id,
      title: item.name,
      slug: item.slug,
      image: process.env.NEXT_PUBLIC_BASE_URL + item.thumb_image,
      price: item.price,
      offer_price: item.offer_price,
      campaingn_product: null,
      review: parseInt(item.averageRating),
      variants: item.active_variants,
    };
  });
  /*product report action method
   * @params (token)
   * if user exists then next process otherwise redirect login page
   * submit request using post method*/
  const productReport = async (id) => {
    if (auth()) {
      setReportLoading(true);
      await apiRequest
        .reportProduct(
          {
            subject: subject,
            description: description,
            product_id: id,
          },
          auth().access_token
        )
        .then((res) => {
          setReportLoading(false);
          toast.success(res.data && res.data.message);
          setSubject("");
          setDescription("");
          setReport(!report);
        })
        .catch((err) => {
          setReportLoading(false);
          console.log(err);
          setReportErrors(err.response && err.response.data.errors);
        });
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Layout childrenClasses="pt-0 pb-0">
        <>
          <div className="single-product-wrapper w-full ">
            <div className="product-view-main-wrapper bg-white pt-[30px] w-full">
              <div className="breadcrumb-wrapper w-full ">
                <div className="container-x mx-auto">
                  <BreadcrumbCom
                    paths={[
                      { name: ServeLangItem()?.home, path: "/" },
                      { name: details.product.slug, path:  `/single-product?slug=${details.product.slug}` },
                    ]}
                  />
                </div>
              </div>
              <div className="w-full bg-white pb-[60px]">
                <div className="container-x mx-auto">
                  {/*key name spelling not correct (gellery)*/}
                  <ProductView
                    product={details.product}
                    images={details.gellery}
                    reportHandler={ReportHandler}
                    seller={details.seller ? details.seller:false}
                  />
                </div>
              </div>
            </div>

            <div
              className="product-des-wrapper w-full relative pb-[60px]"
              ref={reviewElement}
            >
              <div className="tab-buttons w-full mb-10 mt-5 sm:mt-0">
                <div className="container-x mx-auto">
                  <ul className="flex space-x-12 ">
                    <li>
                      <span
                        onClick={() => setTab("des")}
                        className={`py-[15px] sm:text-[15px] text-sm sm:block border-b font-medium cursor-pointer ${
                          tab === "des"
                            ? "border-qyellow text-qblack "
                            : "border-transparent text-qgray"
                        }`}
                      >
                        {ServeLangItem()?.Description}
                      </span>
                    </li>
                    <li>
                      <span
                        onClick={() => setTab("review")}
                        className={`py-[15px] sm:text-[15px] text-sm sm:block border-b font-medium cursor-pointer ${
                          tab === "review"
                            ? "border-qyellow text-qblack "
                            : "border-transparent text-qgray"
                        }`}
                      >
                        {ServeLangItem()?.Reviews}
                      </span>
                    </li>
                    {Multivendor() === 1 && details.is_seller_product && (
                      <li>
                        <span
                          onClick={() => setTab("info")}
                          className={`py-[15px] sm:text-[15px] text-sm sm:block border-b font-medium cursor-pointer ${
                            tab === "info"
                              ? "border-qyellow text-qblack "
                              : "border-transparent text-qgray"
                          }`}
                        >
                          {ServeLangItem()?.Seller_Info}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="w-full h-[1px] bg-[#E8E8E8] absolute left-0 sm:top-[50px] top-[36px] -z-10"></div>
              </div>
              <div className="tab-contents w-full ">
                <div className="container-x mx-auto">
                  {tab === "des" && (
                    <>
                      <h6 className="text-[20px] font-bold text-qblack mb-5">
                        {ServeLangItem()?.Introduction}
                      </h6>
                      <div
                        className="product-detail-des mb-10"
                        dangerouslySetInnerHTML={{
                          __html: details.product.long_description,
                        }}
                      ></div>
                      {/*<div data-aos="fade-up" className="w-full tab-content-item">*/}
                      {/*  <h6 className="text-[18px] font-medium text-qblack mb-2">*/}
                      {/*    Introduction*/}
                      {/*  </h6>*/}
                      {/*  <p className="text-[15px] text-qgray text-normal mb-10">*/}
                      {/*    Lorem Ipsum is simply dummy text of the printing and*/}
                      {/*    typesetting industry. Lorem Ipsum has been the industrys*/}
                      {/*    standard dummy text ever since the 1500s, when an unknown*/}
                      {/*    printer took a galley of type and scrambled it to make a*/}
                      {/*    type specimen book. It has survived not only five*/}
                      {/*    centuries but also the on leap into electronic*/}
                      {/*    typesetting, remaining essentially unchanged. It wasn’t*/}
                      {/*    popularised in the 1960s with the release of Letraset*/}
                      {/*    sheets containing Lorem Ipsum passages, andei more*/}
                      {/*    recently with desktop publishing software like Aldus*/}
                      {/*    PageMaker including versions of Lorem Ipsum to make a type*/}
                      {/*    specimen book.*/}
                      {/*  </p>*/}
                      {details.specifications &&
                        details.specifications.length > 0 && (
                          <div className="product-specifications">
                            <h6 className="text-[20px] font-bold mb-4">
                              {ServeLangItem()?.Features} :
                            </h6>
                            <ul className="">
                              {details.specifications.map((item, i) => (
                                <li
                                  key={i}
                                  className=" leading-9 flex space-x-3 items-center"
                                >
                                  <span className="text-qblack font-medium capitalize"> {item.key.key}:</span>
                                  <span className="font-normal text-qgray">
                                    {item.specification}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      {/*</div>*/}
                    </>
                  )}
                  {tab === "review" && (
                    <div data-aos="fade-up" className="w-full tab-content-item">
                      <h6 className="text-[20px] font-bold text-qblack mb-2">
                        {ServeLangItem()?.Reviews}
                      </h6>
                      {/* review-comments */}
                      <div className="w-full">
                        <Reviews
                          comments={commnets.length > 0 && commnets.slice(0, 2)}
                        />
                      </div>
                    </div>
                  )}
                  {tab === "info" && (
                    <div data-aos="fade-up" className="w-full tab-content-item">
                      {details.seller && (
                        <SallerInfo
                          sellerInfo={sellerInfo}
                          products={
                            details.this_seller_products.length > 0 &&
                            details.this_seller_products.slice(
                              0,
                              details.this_seller_products.length > 8
                                ? 8
                                : details.this_seller_products.length
                            )
                          }
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {relatedProducts.length > 0 && (
              <div className="related-product w-full bg-white">
                <div className="container-x mx-auto">
                  <div className="w-full py-[60px]">
                    <h1 className="sm:text-3xl text-xl font-600 text-qblacktext leading-none mb-[30px]">
                      {ServeLangItem()?.Related_Product}
                    </h1>
                    <div
                      data-aos="fade-up"
                      className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 xl:gap-[30px] gap-5"
                    >
                      <DataIteration
                        datas={relatedProducts}
                        startLength={0}
                        endLength={
                          relatedProducts.length > 4
                            ? 4
                            : relatedProducts.length
                        }
                      >
                        {({ datas }) => (
                          <div key={datas.id} className="item">
                            <ProductCardStyleOne datas={datas} />
                          </div>
                        )}
                      </DataIteration>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {report && (
            <div className="w-full h-full flex fixed left-0 top-0 justify-center z-50 items-center">
              <div
                onClick={() => setReport(!report)}
                className="w-full h-full fixed left-0 right-0 bg-black  bg-opacity-25"
              ></div>
              <div
                data-aos="fade-up"
                className="sm:w-[548px] w-full bg-white relative py-[40px] px-[38px]"
                style={{ zIndex: "999" }}
              >
                <div className="title-bar flex items-center justify-between mb-3">
                  <h6 className="text-2xl font-medium">{ServeLangItem()?.Report_Products}</h6>
                  <span
                    className="cursor-pointer"
                    onClick={() => setReport(!report)}
                  >
                    <svg
                      width="54"
                      height="54"
                      viewBox="0 0 54 54"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M26.9399 54.0001C12.0678 53.9832 -0.0210736 41.827 2.75822e-05 26.9125C0.0211287 12.0507 12.1965 -0.0315946 27.115 6.20658e-05C41.9703 0.0317188 54.0401 12.2153 54 27.1404C53.9599 41.9452 41.7972 54.0191 26.9399 54.0001ZM18.8476 16.4088C17.6765 16.4404 16.9844 16.871 16.6151 17.7194C16.1952 18.6881 16.3893 19.5745 17.1363 20.3258C19.0966 22.2906 21.0252 24.2913 23.0425 26.197C23.7599 26.8745 23.6397 27.2206 23.0045 27.8305C21.078 29.6793 19.2148 31.5956 17.3241 33.4802C16.9211 33.8812 16.5581 34.3012 16.4505 34.8857C16.269 35.884 16.6953 36.8337 17.5456 37.3106C18.4382 37.8129 19.5038 37.6631 20.3394 36.8421C22.3673 34.8435 24.3866 32.8365 26.3723 30.7999C26.8513 30.3082 27.1298 30.2871 27.6193 30.7915C29.529 32.7584 31.4851 34.6789 33.4201 36.6184C33.8463 37.0447 34.2831 37.4436 34.9098 37.5491C35.9184 37.7201 36.849 37.2895 37.3196 36.4264C37.7964 35.5548 37.6677 34.508 36.8912 33.7144C34.9731 31.756 33.0677 29.7806 31.0631 27.9149C30.238 27.1467 30.3688 26.7479 31.1031 26.0535C32.9896 24.266 34.8022 22.3982 36.6338 20.5516C37.7922 19.3845 37.8914 17.9832 36.9081 17.0293C35.9501 16.1007 34.5975 16.2146 33.4623 17.3416C31.5188 19.2748 29.5649 21.1995 27.6594 23.1664C27.1446 23.6983 26.8492 23.6962 26.3343 23.1664C24.4267 21.1974 22.4664 19.2811 20.5336 17.3374C19.9997 16.7971 19.4258 16.3666 18.8476 16.4088Z"
                        fill="#F34336"
                      />
                    </svg>
                  </span>
                </div>

                <div className="inputs w-full">
                  <div className="w-full mb-5">
                    <InputCom
                      label={ServeLangItem()?.Enter_Report_Ttile+"*"}
                      placeholder={ServeLangItem()?.Reports_Headline_here}
                      type="text"
                      name="name"
                      inputClasses="h-[50px]"
                      labelClasses="text-[13px] font-600 leading-[24px] text-qblack"
                      value={subject}
                      inputHandler={(e) => setSubject(e.target.value)}
                      error={
                        !!(
                          reportErrors &&
                          Object.hasOwn(reportErrors, "subject")
                        )
                      }
                    />
                    {reportErrors &&
                    Object.hasOwn(reportErrors, "subject") ? (
                      <span className="text-sm mt-1 text-qred">
                        {reportErrors.subject[0]}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="w-full mb-[40px]">
                    <h6 className="input-label  capitalize text-[13px] font-600 leading-[24px] text-qblack block mb-2 ">
                      {ServeLangItem()?.Enter_Report_Note}*
                    </h6>
                    <textarea
                      name=""
                      id=""
                      cols="30"
                      rows="6"
                      className={`w-full focus:ring-0 focus:outline-none py-3 px-4 border  placeholder:text-sm text-sm ${
                        reportErrors ? "border-qred" : "border-qgray-border"
                      }`}
                      placeholder={ServeLangItem()?.Type_Here}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    {reportErrors && Object.hasOwn(reportErrors, "description") ? (
                      <span className="text-sm mt-1 text-qred">
                        {reportErrors.description[0]}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <button
                    onClick={() => productReport(details.product.id)}
                    type="button"
                    className="black-btn flex h-[50px] items-center justify-center w-full"
                  >
                    <span>{ServeLangItem()?.Submit_Report}</span>
                    {reportLoading && (
                      <span
                        className="w-5 "
                        style={{ transform: "scale(0.3)" }}
                      >
                        <LoaderStyleOne />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      </Layout>
    </>
  );
}
