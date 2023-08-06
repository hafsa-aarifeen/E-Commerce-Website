import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import isAuth from "../../../Middleware/isAuth";
import apiRequest from "../../../utils/apiRequest";
import auth from "../../../utils/auth";
import settings from "../../../utils/settings";
import BreadcrumbCom from "../BreadcrumbCom";
import InputCom from "../Helpers/InputCom";
import LoaderStyleOne from "../Helpers/Loaders/LoaderStyleOne";
import StarRating from "../Helpers/StarRating";
import ServeLangItem from "../Helpers/ServeLangItem";
function OrderCom() {
  const router = useRouter();
  const { id } = router.query;
  const [resData, setResData] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  // const fetchData = async () => {
  //   await axios
  //     .get(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}user/order-show/${id}?token=${
  //         auth().access_token
  //       }`
  //     )
  //     .then((res) => {
  //       if (res.data && res.data.order) {
  //         setResData(res.data && res.data.order);
  //       } else {
  //         router.push("/tracking-order");
  //         toast.error("Order not found");
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  useEffect(() => {
    if (auth()) {
      if (!resData) {
        axios
          .get(
            `${
              process.env.NEXT_PUBLIC_BASE_URL
            }api/user/order-show/${id}?token=${auth().access_token}`
          )
          .then((res) => {
            setResData(res.data && res.data.order);
            const status = () => {
              switch (
                res.data &&
                res.data.order &&
                parseInt(res.data.order.order_status)
              ) {
                case 0:
                  return "Pending";
                case 1:
                  return "Progress";
                case 2:
                  return "Delivered";
                case 3:
                  return "Completed";
                case 4:
                  return "Declined";
                default:
                  return "Pending";
              }
            };
            setOrderStatus(status);

            // if (res.data && res.data.order) {
            //
            // } else {
            //   router.push("/tracking-order");
            // }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      router.push(`/login`);
    }
  });
  const { currency_icon } = settings();
  // const PrintDiv = () => {
  //   var contents = document.getElementById("printSection").innerHTML;
  //   var frame1 = document.createElement("iframe");
  //   frame1.name = "frame1";
  //   frame1.style.position = "absolute";
  //   frame1.style.top = "-1000000px";
  //   document.body.appendChild(frame1);
  //   var frameDoc = frame1.contentWindow
  //     ? frame1.contentWindow
  //     : frame1.contentDocument.document
  //     ? frame1.contentDocument.document
  //     : frame1.contentDocument;
  //   frameDoc.document.open();
  //   frameDoc.document.write("<html>");
  //   frameDoc.document.write(contents);
  //   frameDoc.document.write("</html>");
  //   frameDoc.document.close();
  //   setTimeout(function () {
  //     window.frames["frame1"].focus();
  //     window.frames["frame1"].print();
  //     document.body.removeChild(frame1);
  //   }, 500);
  //   return false;
  // };
  const print = () => {
    window.print();
  };

  /*review*/
  const [reviewModal, setReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [reviewLoading, setLoading] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const reviewModalHandler = (id) => {
    setReviewModal(!reviewModal);
    setReviewId(id);
  };
  const reviewAction = () => {
    setLoading(true);
    if (auth()) {
      apiRequest
        .productReview(
          {
            rating: rating,
            product_id: reviewId,
            review: message,
          },
          auth().access_token
        )
        .then((res) => {
          toast.success(res.data && res.data.message);
          setLoading(false);
          setName("");
          setMessage("");
          setRating(0);
          setHover(0);
          setReviewId(null);
          setReviewModal(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          if (err.response && err.response.data.errors) {
            toast.error("Invalid data");
          }
          if (err.response && err.response.data.message) {
            toast.error(err.response.data.message);
          }
        });
    } else {
      setLoading(false);
    }
  };
  // setLoading(false);
  // setName("");
  // setEmail("");
  // setPhone("");
  // setMessage("");
  // setRating(0);
  // setHover(0);
  return (
    <>
      <div className="order-tracking-wrapper w-full">
        <div className="container-x mx-auto">
          <BreadcrumbCom
            paths={[
              { name: ServeLangItem()?.home, path: "/" },
              { name: ServeLangItem()?.Order, path: `/order/${id}` },
            ]}
          />
          {resData && (
            <div className="w-full h-[168px]  bg-[#CBECFF] rounded-2xl mb-10 relative print:hidden">
              <div className="w-full px-10 flex justify-between pt-3 mb-7">
                <div>
                  {resData.order_delivered_date && (
                    <p className="text-base font-400">
                      {ServeLangItem()?.Delivered_on}{" "}
                      {resData.order_delivered_date}
                    </p>
                  )}
                </div>
                <div>
                  {orderStatus === "Declined" && (
                    <p className="text-base font-bold text-qred mr-10">
                      {ServeLangItem()?.Your_order_is_declined}!
                    </p>
                  )}
                </div>
              </div>
              <div className="flex lg:space-x-[373px] space-x-[90px] rtl:space-x-reverse w-full h-full justify-center">
                <div className="relative">
                  <div className="w-[30px] h-[30px] border-[8px] rounded-full border-qyellow bg-white relative z-20"></div>
                  <p className="absolute -left-4 top-10 sm:text-base text-sm font-400">
                    {ServeLangItem()?.Pending}
                  </p>
                </div>
                {/*orderStatus*/}
                <div className="relative">
                  <div
                    className={`w-[30px] h-[30px] border-[8px] rounded-full  bg-white relative z-20 ${
                      orderStatus === "Progress" ||
                      orderStatus === "Delivered" ||
                      orderStatus === "Completed"
                        ? "border-qyellow"
                        : "border-qgray"
                    }`}
                  ></div>
                  <div
                    className={`lg:w-[400px] w-[100px] h-[8px] absolute ltr:lg:-left-[390px] ltr:-left-[92px] rtl:lg:-right-[390px] rtl:-right-[92px] top-[10px] z-10  ${
                      orderStatus === "Progress" ||
                      orderStatus === "Delivered" ||
                      orderStatus === "Completed"
                        ? "bg-qyellow"
                        : "bg-white"
                    }`}
                  ></div>
                  <p className="absolute -left-4 top-10 sm:text-base text-sm font-400">
                    {ServeLangItem()?.Progress}
                  </p>
                </div>
                <div className="relative">
                  <div
                    className={`w-[30px] h-[30px] border-[8px] rounded-full bg-white  relative z-20 ${
                      orderStatus === "Delivered" || orderStatus === "Completed"
                        ? "border-qyellow"
                        : "border-qgray"
                    }`}
                  ></div>
                  <div
                    className={`lg:w-[400px] w-[100px] h-[8px] absolute ltr:lg:-left-[390px] ltr:-left-[92px] rtl:lg:-right-[390px] rtl:-right-[92px] top-[10px] z-10 ${
                      orderStatus === "Delivered" || orderStatus === "Completed"
                        ? "bg-qyellow"
                        : "bg-white"
                    }`}
                  ></div>
                  <p className="absolute -left-4 top-10 sm:text-base text-sm font-400">
                    {ServeLangItem()?.Delivered}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white lg:p-10 p-3 rounded-xl">
            {resData && (
              <div id="printSection">
                <div className="sm:flex justify-between items-center mb-4">
                  <div>
                    <h1 className="text-[26px] font-semibold text-qblack mb-2.5">
                      {resData.order_address &&
                        resData.order_address.billing_name}
                    </h1>
                    <ul className="flex flex-col space-y-0.5">
                      <li className="text-[22px]n text-[#4F5562]">
                        {ServeLangItem()?.Order_ID}:{" "}
                        <span className="text-[#27AE60]">
                          {resData.order_id}
                        </span>
                      </li>
                      <li className="text-[22px]n text-[#4F5562]">
                        {ServeLangItem()?.Billing_Address}:{" "}
                        <span className="text-[#27AE60]">{`${
                          resData.order_address &&
                          resData.order_address.billing_address
                        },${
                          resData.order_address &&
                          resData.order_address.billing_city
                        },${
                          resData.order_address &&
                          resData.order_address.billing_state
                        }`}</span>
                      </li>
                      <li className="text-[22px]n text-[#4F5562]">
                        {ServeLangItem()?.Shipping_Address}:{" "}
                        <span className="text-[#27AE60]">{`${
                          resData.order_address &&
                          resData.order_address.shipping_address
                        },${
                          resData.order_address &&
                          resData.order_address.shipping_city
                        },${
                          resData.order_address &&
                          resData.order_address.shipping_state
                        }`}</span>
                      </li>
                      <li className="text-[22px]n text-[#4F5562]">
                        {ServeLangItem()?.Type}:{" "}
                        <span className="text-[#27AE60]">
                          {resData.order_address &&
                          parseInt(
                            resData.order_address.shipping_address_type
                          ) === 1
                            ? "Office"
                            : "Home"}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <button
                      onClick={print}
                      type="button"
                      className="w-[161px] h-[52px] rounded flex space-x-2.5 rtl:space-x-reverse items-center justify-center bg-qyellow print:hidden mt-5 sm:mt-0"
                    >
                      <span>
                        <svg
                          width="27"
                          height="26"
                          viewBox="0 0 27 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M24.9 6.10885H22.0364V0.900017C22.0364 0.402996 21.6334 0 21.1364 0H5.86364C5.36662 0 4.96362 0.402943 4.96362 0.900017V6.10885H2.09999C0.942047 6.10885 0 7.05095 0 8.2089V17.2635C0 18.4214 0.942047 19.3635 2.09999 19.3635H4.96378V24.1947C4.96378 24.6917 5.36672 25.0947 5.8638 25.0947H21.1362C21.6332 25.0947 22.0362 24.6918 22.0362 24.1947V19.3635H24.9C26.058 19.3635 27 18.4214 27 17.2635V8.2089C27 7.05101 26.058 6.10885 24.9 6.10885ZM6.76361 1.80004H20.2363V6.10885H6.76361V1.80004ZM20.2362 23.2947H6.76382C6.76382 23.1188 6.76382 16.149 6.76382 15.9315H20.2362C20.2362 16.1545 20.2362 23.1256 20.2362 23.2947ZM21.1364 11.3936H18.8454C18.3484 11.3936 17.9454 10.9907 17.9454 10.4936C17.9454 9.99654 18.3483 9.5936 18.8454 9.5936H21.1364C21.6334 9.5936 22.0364 9.99654 22.0364 10.4936C22.0364 10.9907 21.6334 11.3936 21.1364 11.3936Z"
                            fill="#222222"
                          />
                        </svg>
                      </span>
                      <span className="text-sm text-qblack">
                        {ServeLangItem()?.Print_PDF}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="relative w-full overflow-x-auto overflow-style-none border border-[#EDEDED] box-border mb-10">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <tbody>
                      {/* table heading */}
                      <tr className="text-[13px] font-medium text-black bg-[#F6F6F6] whitespace-nowrap px-2 border-b default-border-bottom uppercase">
                        <td className=" py-4 ltr:pl-10 rtl:pr-10 block whitespace-nowrap rtl:text-right  w-[380px]">
                          {ServeLangItem()?.Product}
                        </td>
                        <td className="py-4 whitespace-nowrap  text-center">
                          {ServeLangItem()?.quantity}
                        </td>
                        <td className="py-4 whitespace-nowrap text-center">
                          {ServeLangItem()?.price}
                        </td>
                        <td className="py-4 whitespace-nowrap text-center capitalize">
                          {ServeLangItem()?.SUBTOTAL}
                        </td>
                        <td className="py-4 whitespace-nowrap text-center print:hidden">
                          {ServeLangItem()?.review}
                        </td>
                      </tr>
                      {/* table heading end */}
                      {resData.order_products.length > 0 &&
                        resData.order_products.map((item, i) => (
                          <tr
                            key={i}
                            className="bg-white border-b hover:bg-gray-50"
                          >
                            <td className="pl-10 w-[400px] py-4 ">
                              <div className="flex space-x-6 items-center">
                                {/*<div className="w-[80px] h-[80px] overflow-hidden flex justify-center items-center border border-[#EDEDED] relative">*/}
                                {/*  <Image*/}
                                {/*    layout="fill"*/}
                                {/*    objectFit="scale-down"*/}
                                {/*    src={`/assets/images/product-img-1.jpg`}*/}
                                {/*    alt="product"*/}
                                {/*    className="w-full h-full object-contain"*/}
                                {/*  />*/}
                                {/*</div>*/}
                                <div className="flex-1 flex flex-col">
                                  <p className="font-medium text-[15px] text-qblack rtl:text-right rtl:pr-10">
                                    {item.product_name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className=" py-4">
                              <div className="flex justify-center items-center">
                                <div className="w-[54px] h-[40px] justify-center flex items-center border border-qgray-border">
                                  <span>{item.qty}</span>
                                </div>
                              </div>
                            </td>
                            <td className="text-center py-4 px-2">
                              <div className="flex space-x-1 items-center justify-center">
                                <span className="text-[15px] font-normal">
                                  <span>{currency_icon}</span>
                                  <span>{item.unit_price}</span>
                                </span>
                              </div>
                            </td>
                            <td className="text-center py-4 px-2">
                              <div className="flex space-x-1 items-center justify-center">
                                <span className="text-[15px] font-normal">
                                  <span>{currency_icon}</span>
                                  <span>
                                    {(item.unit_price * item.qty).toFixed(2)}
                                  </span>
                                </span>
                              </div>
                            </td>
                            <td className="text-center py-4 px-2 print:hidden">
                              <button
                                onClick={() =>
                                  reviewModalHandler(item.product_id)
                                }
                                type="button"
                                className="text-green-500 text-sm font-semibold capitalize"
                              >
                                {ServeLangItem()?.review}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex sm:justify-end print:justify-end justify-center sm:mr-10">
                  <div>
                    <div className="flex justify-between font-semibold w-[200px] mb-1">
                      <p className="text-sm text-qblack capitalize">
                        {ServeLangItem()?.SUBTOTAL}
                      </p>
                      <p className="text-sm text-qblack">
                        <span>{currency_icon}</span>
                        <span>
                          {parseFloat(resData.total_amount) -
                            parseFloat(resData.shipping_cost) +
                            parseFloat(resData.coupon_coast)}
                        </span>
                      </p>
                    </div>
                    <div className="flex justify-between font-semibold w-[200px]">
                      <p className="text-sm text-qred">
                        (-) {ServeLangItem()?.Discount_coupon}
                      </p>
                      <p className="text-sm text-qred">
                        -<span>{currency_icon}</span>
                        <span>{resData.coupon_coast}</span>
                      </p>
                    </div>
                    <div className="flex justify-between font-semibold w-[200px]">
                      <p className="text-sm text-qblack">
                        (+) {ServeLangItem()?.Shipping_Cost}
                      </p>
                      <p className="text-sm text-qblack">
                        +<span>{currency_icon}</span>
                        <span>{resData.shipping_cost}</span>
                      </p>
                    </div>
                    <div className="w-full h-[1px] bg-qgray-border mt-4"></div>
                    <div className="flex justify-between font-semibold w-[200px] mt-4">
                      <p className="text-lg text-qblack">
                        {ServeLangItem()?.Total_Paid}
                      </p>
                      <p className="text-lg text-qblack">
                        <span>{currency_icon}</span>
                        <span>{parseInt(resData.total_amount)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {reviewModal && (
        <div className="w-full h-full flex fixed left-0 top-0 justify-center z-50 items-center">
          <div
            onClick={() => setReviewModal(!reviewModal)}
            className="w-full h-full fixed left-0 right-0 bg-black  bg-opacity-25"
          ></div>
          <div
            data-aos="fade-up"
            className="sm:w-1/2 w-full bg-white relative py-[40px] px-[38px]"
            style={{ zIndex: "999" }}
          >
            <div className="title-bar flex items-center justify-between mb-3">
              <h1 className="text-2xl font-medium text-qblack mb-5">
                {ServeLangItem()?.Write_Your_Reviews}
              </h1>
              <span
                className="cursor-pointer"
                onClick={() => setReviewModal(!reviewModal)}
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

            <div className="write-review w-full">
              <div className="flex space-x-1 items-center mb-[30px]">
                <StarRating
                  hoverRating={hover}
                  hoverHandler={setHover}
                  rating={rating}
                  ratingHandler={setRating}
                />
                <span className="text-qblack text-[15px] font-normal mt-1">
                  ({rating}.0)
                </span>
              </div>

              <div className="w-full review-form ">
                <div className=" w-full mb-[30px]">
                  <InputCom
                    label="name"
                    placeholder=""
                    type="text"
                    name="name"
                    inputClasses="h-[50px]"
                    value={name}
                    inputHandler={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-full mb-[30px]">
                  <h6 className="input-label text-qgray capitalize text-[13px] font-normal block mb-2 ">
                    {ServeLangItem()?.Message}*
                  </h6>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    name=""
                    id=""
                    cols="30"
                    rows="3"
                    className="w-full focus:ring-0 border border-qgray-border focus:outline-none p-6 o"
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={reviewAction}
                    type="button"
                    className="black-btn w-[300px] h-[50px]  flex justify-center"
                  >
                    <span className="flex space-x-1 items-center h-full">
                      <span className="text-sm font-semibold">
                        {ServeLangItem()?.Submit_Review}
                      </span>
                      {reviewLoading && (
                        <span
                          className="w-5 "
                          style={{ transform: "scale(0.3)" }}
                        >
                          <LoaderStyleOne />
                        </span>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default isAuth(OrderCom);
