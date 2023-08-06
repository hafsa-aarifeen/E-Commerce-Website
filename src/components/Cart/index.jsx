import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiRequest from "../../../utils/apiRequest";
import auth from "../../../utils/auth";
import settings from "../../../utils/settings";
import { fetchCart } from "../../store/Cart";
import CheckProductIsExistsInFlashSale from "../Shared/CheckProductIsExistsInFlashSale";
import ServeLangItem from "../Helpers/ServeLangItem";

export default function Cart({ className }) {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const [getCarts, setGetCarts] = useState(null);
  const [getAllPrice, setGetAllPrice] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  useEffect(() => {
    setTotalPrice( getAllPrice && getAllPrice.reduce((prev, curr) => parseFloat(prev) + parseFloat(curr)))
  }, [getAllPrice]);
  useEffect(() => {
    cart && setGetCarts(cart.cartProducts);
  }, [cart]);
  const checkProductExistsInFlashSale = (id, price) => {
    if (websiteSetup) {
      const flashSaleOffer =
        websiteSetup.payload.flashSale && websiteSetup.payload.flashSale.offer;
      const flashSaleIds =
        websiteSetup.payload.flashSaleProducts.length > 0 &&
        websiteSetup.payload.flashSaleProducts.find(
          (item) => parseInt(item.product_id) === parseInt(id)
        );
      if (flashSaleOffer && flashSaleIds) {
        const offer = parseInt(flashSaleOffer);

        const discountPrice = (offer / 100) * price; //confusion
        const mainPrice = price - discountPrice;
        return mainPrice;
      } else {
        return price;
      }
    }
  };
  useEffect(() => {
    if (getCarts && getCarts.length > 0) {
      setGetAllPrice(
        getCarts.map((v) => {
          if (v.product.offer_price) {
            if (v.variants && v.variants.length > 0) {
              const prices = v.variants.map((item) =>
                item.variant_item ? parseInt(item.variant_item.price) : 0
              );
              const sumCal = prices.reduce((p, c) => p + c);
              const v_price = sumCal + parseInt(v.product.offer_price);
              return checkProductExistsInFlashSale(v.product_id, v_price);
            } else {
              const wo_v_price = v.product.offer_price;
              return checkProductExistsInFlashSale(v.product_id, wo_v_price);
            }
          } else {
            if (v.variants && v.variants.length > 0) {
              const prices = v.variants.map((item) =>
                item.variant_item ? parseInt(item.variant_item.price) : 0
              );
              const sumCal = prices.reduce((p, c) => p + c);
              const v_price = sumCal + parseInt(v.product.price);
              return checkProductExistsInFlashSale(v.product_id, v_price);
            } else {
              const wo_v_price = v.product.price;
              return checkProductExistsInFlashSale(v.product_id, wo_v_price);
            }
          }
        })
      );
    }else{
      setGetAllPrice(null);
    }
  }, [getCarts]);

  const deleteItem = (id) => {
    if (auth()) {
      apiRequest
        .deleteCartItem({
          id: id,
          token: auth().access_token,
        })
        .then(() => {
          toast.warn(ServeLangItem()?.Remove_from_Cart, {
            autoClose: 1000,
          });
          dispatch(fetchCart());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return false;
    }
  };

  const price = (item) => {
    if (item) {
      if (item.product.offer_price) {
        if (item.variants && item.variants.length > 0) {
          const prices = item.variants.map((item) =>
            item.variant_item ? parseInt(item.variant_item.price) : 0
          );
          const sumVarient = prices.reduce((p, c) => p + c);
          return parseInt(item.product.offer_price) + sumVarient;
          // return CheckProductIsExistsInFlashSale({
          //   id: item.product_id,
          //   price: totalPrice,
          // });
        } else {
          return item.product.offer_price;
          // return CheckProductIsExistsInFlashSale({
          //   id: item.product_id,
          //   price: parseInt(item.product.offer_price),
          // });
        }
      } else {
        if (item.variants && item.variants.length > 0) {
          const prices = item.variants.map((item) =>
            item.variant_item ? parseInt(item.variant_item.price) : 0
          );
          const sumVarient = prices.reduce((p, c) => p + c);
          return parseInt(item.product.price) + sumVarient;
          // return CheckProductIsExistsInFlashSale({
          //   id: item.product_id,
          //   price: totalPrice,
          // });
        } else {
          return item.product.price;
          // return CheckProductIsExistsInFlashSale({
          //   id: item.product_id,
          //   price: parseInt(item.product.price),
          // });
        }
      }
    }
  };
  const { currency_icon } = settings();
  return (
    <>
      <div
        style={{ boxShadow: " 0px 15px 50px 0px rgba(0, 0, 0, 0.14)" }}
        className={`cart-wrappwer w-[300px] bg-white border-t-[3px] ${
          className || ""
        }`}
      >
        <div className="w-full h-full">
          <div className="product-items h-[310px] overflow-y-scroll">
            <ul>
              {getCarts &&
                getCarts.length > 0 &&
                getCarts.map((item, i) => (
                  <li
                    key={item.id}
                    className="w-full h-full flex justify-between"
                  >
                    <div className="flex space-x-[6px] justify-center items-center px-4 my-[20px]">
                      <div className="w-[65px] h-full relative">
                        <Image
                          layout="fill"
                          src={`${
                            process.env.NEXT_PUBLIC_BASE_URL +
                            item.product.thumb_image
                          }`}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 h-full flex flex-col justify-center ">
                        <p className="title mb-2 text-[13px] font-600 text-qblack leading-4 line-clamp-2 hover:text-blue-600">
                          {item.product.name}
                        </p>

                        <p className="price">
                          <span
                            suppressHydrationWarning
                            className="offer-price text-qred font-600 text-[15px] ml-2"
                          >
                            {
                              <CheckProductIsExistsInFlashSale
                                id={item.product_id}
                                price={price(item)}
                              />
                            }
                            {/*{item.product.offer_price*/}
                            {/*  ? item.variants.length > 0*/}
                            {/*    ? item.variants.reduce(*/}
                            {/*        (p, c) =>*/}
                            {/*          parseInt(p.variant_item.price) +*/}
                            {/*          parseInt(c.variant_item.price) +*/}
                            {/*          parseInt(item.product.offer_price)*/}
                            {/*      )*/}
                            {/*    : parseInt(item.product.offer_price)*/}
                            {/*  : item.variants.length > 0*/}
                            {/*  ? item.variants.reduce(*/}
                            {/*      (p, c) =>*/}
                            {/*        parseInt(p.variant_item.price) +*/}
                            {/*        parseInt(c.variant_item.price) +*/}
                            {/*        parseInt(item.product.price)*/}
                            {/*    )*/}
                            {/*  : parseInt(item.product.price)}*/}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span
                      onClick={() => deleteItem(item.id)}
                      className="mt-[20px] mr-[15px] inline-flex cursor-pointer"
                    >
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                        className="inline fill-current text-[#AAAAAA] hover:text-qred"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7.76 0.24C7.44 -0.08 6.96 -0.08 6.64 0.24L4 2.88L1.36 0.24C1.04 -0.08 0.56 -0.08 0.24 0.24C-0.08 0.56 -0.08 1.04 0.24 1.36L2.88 4L0.24 6.64C-0.08 6.96 -0.08 7.44 0.24 7.76C0.56 8.08 1.04 8.08 1.36 7.76L4 5.12L6.64 7.76C6.96 8.08 7.44 8.08 7.76 7.76C8.08 7.44 8.08 6.96 7.76 6.64L5.12 4L7.76 1.36C8.08 1.04 8.08 0.56 7.76 0.24Z" />
                      </svg>
                    </span>
                  </li>
                ))}
            </ul>
            {getCarts && getCarts.length === 0 && (
              <p className="text-sm text-gray-400 mt-10 text-center">
                {ServeLangItem()?.No_items_found}
              </p>
            )}
          </div>
          <div className="w-full px-4 mt-[20px] mb-[12px]">
            <div className="h-[1px] bg-[#F0F1F3]"></div>
          </div>
          <div className="product-actions px-4 mb-[30px]">
            <div className="total-equation flex justify-between items-center mb-[28px]">
              <span className="text-[15px] font-500 text-qblack">Subtotal</span>
              <span
                suppressHydrationWarning
                className="text-[15px] font-500 text-qred "
              >
                {currency_icon + (totalPrice ? parseFloat(totalPrice).toFixed(2) : 0)}
              </span>
            </div>
            <div className="product-action-btn">
              <Link href="/cart">
                <div className="gray-btn w-full h-[50px] mb-[10px] cursor-pointer ">
                  <span>{ServeLangItem()?.View_Cart}</span>
                </div>
              </Link>
              <Link href="/checkout">
                <div className="w-full h-[50px] cursor-pointer">
                  <div className="yellow-btn">
                    <span className="text-sm">{ServeLangItem()?.Checkout_Now}</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="w-full px-4 mt-[20px]">
            <div className="h-[1px] bg-[#F0F1F3]"></div>
          </div>
          <div className="flex justify-center py-[15px]">
            <p className="text-[13px] font-500 text-qgray">
              {ServeLangItem()?.Get_Return_within}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
