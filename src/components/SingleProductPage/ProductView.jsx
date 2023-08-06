import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { toast } from "react-toastify";
import apiRequest from "../../../utils/apiRequest";
import auth from "../../../utils/auth";
import settings from "../../../utils/settings";
import { fetchCart } from "../../store/Cart";
import { fetchWishlist } from "../../store/wishlistData";
import Star from "../Helpers/icons/Star";
import ThinLove from "../Helpers/icons/ThinLove";
import Selectbox from "../Helpers/Selectbox";
import CheckProductIsExistsInFlashSale from "../Shared/CheckProductIsExistsInFlashSale";
import ServeLangItem from "../Helpers/ServeLangItem";
import LoginContext from "../Contexts/LoginContext";
import messageContext from "../Contexts/MessageContext";

const Redirect = () => {
  return (
    <div className="flex space-x-2 items-center">
      <span className="text-sm text-gray-500">
        {ServeLangItem()?.Item_added}
      </span>
      <Link href="/cart">
        <span className="text-xs border-b border-blue-600 text-blue-600 mr-2 cursor-pointer">
          {ServeLangItem()?.Go_To_Cart}
        </span>
      </Link>
    </div>
  );
};
export default function ProductView({
  className,
  reportHandler,
  images = [],
  product,
    seller
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [more, setMore] = useState(false);
  const productsImg = images && images.length > 0 && images;
  const varients =
    product && product.active_variants.length > 0 && product.active_variants;
  const [getFirstVarients, setFirstVarients] = useState(
    varients &&
      varients.map((v) =>
        v.active_variant_items.length > 0 ? v.active_variant_items[0] : {}
      )
  );
  const [price, setPrice] = useState(null);
  const [offerPrice, setOffer] = useState(null);
  const [src, setSrc] = useState(product.thumb_image);
  const tags = product && JSON.parse(product.tags);
  const loginPopupBoard = useContext(LoginContext);
  const messageHandler=useContext(messageContext);
  const changeImgHandler = (current) => {
    setSrc(current);
  };
  const [quantity, setQuantity] = useState(1);
  const increment = () => {
    setQuantity((prev) => prev + 1);
  };
  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  //varient selector handler
  const selectVarient = (value) => {
    if (varients.length > 0) {
      const replacePrice = getFirstVarients.map((v) => {
        if (
          parseInt(v.product_variant_id) === parseInt(value.product_variant_id)
        ) {
          return value;
        }
        return v;
      });
      setFirstVarients(replacePrice);
    }
  };
  useEffect(() => {
    if (varients) {
      const prices =
        getFirstVarients &&
        getFirstVarients.map((v) => (v.price ? v.price : 0));
      const sumPrice = parseInt(
        prices.reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0) +
          parseInt(product.price)
      );
      setPrice(sumPrice);
      if (product.offer_price) {
        const sumOfferPrice = parseInt(
          prices.reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0) +
            parseInt(product.offer_price)
        );
        setOffer(sumOfferPrice);
      }
    }
  }, [getFirstVarients, varients]);

  useEffect(() => {
    // if (varients) {
    //   const prices = varients.map((v) =>
    //     v.active_variant_items.length > 0 ? v.active_variant_items[0].price : 0
    //   );
    //   const sumPrice = parseInt(
    //     prices.reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0) +
    //       parseInt(product.price)
    //   );
    //   setPrice(sumPrice);
    //
    //   if (product.offer_price) {
    //     const sumOfferPrice = parseInt(
    //       prices.reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0) +
    //         parseInt(product.offer_price)
    //     );
    //     setOffer(sumOfferPrice);
    //   }
    // } else {
    //   setPrice(product && product.price);
    // }
    if (varients) {
      const prices = varients.map((v) =>
        v.active_variant_items.length > 0 && v.active_variant_items[0].price
          ? parseInt(v.active_variant_items[0].price)
          : 0
      );

      if (product.offer_price) {
        const sumCalc = prices.reduce(
          (prev, curr) => parseInt(prev) + parseInt(curr)
        );
        const sumPrice = parseInt(sumCalc) + parseInt(product.price);
        const sumOfferPrice = parseInt(sumCalc) + parseInt(product.offer_price);
        setPrice(sumPrice);
        setOffer(sumOfferPrice);
      } else {
        const sumCalc = prices.reduce(
          (prev, curr) => parseInt(prev) + parseInt(curr)
        );
        const sumPrice = parseInt(sumCalc) + parseInt(product.price);
        setPrice(sumPrice);
      }
    } else {
      setPrice(product && product.price);
      setOffer(product && product.offer_price);
    }
  }, [product, varients]);

  const addToCard = () => {
    const data = {
      id: product.id,
      token: auth() && auth().access_token,
      quantity: quantity,
      variants:
          getFirstVarients &&
          getFirstVarients.map((v) => parseInt(v.product_variant_id)),
      variantItems: getFirstVarients && getFirstVarients.map((v) => v.id),
    };
    if (auth()) {
      if (varients) {
        const variantQuery = data.variants.map((value, index) => {
          return `variants[]=${value}`;
        });
        const variantString = variantQuery.map((value) => value + "&").join("");

        const itemsQuery = data.variantItems.map((value, index) => {
          return `items[]=${value}`;
        });
        const itemQueryStr = itemsQuery.map((value) => value + "&").join("");
        const uri = `token=${data.token}&product_id=${data.id}&${variantString}${itemQueryStr}quantity=${data.quantity}`;
        apiRequest
          .addToCard(uri)
          .then((res) =>
            toast.success(<Redirect />, {
              autoClose: 5000,
            })
          )
          .catch((err) => console.log(err));
        dispatch(fetchCart());
      } else {
        const uri = `token=${data.token}&product_id=${data.id}&quantity=${data.quantity}`;
        apiRequest
          .addToCard(uri)
          .then((res) => {
            toast.success(<Redirect />, {
              autoClose: 5000,
            });
            toast.error(
              res.response &&
                res.response.data.message &&
                res.response.data.message
            );
          })
          .catch((err) => {
            console.log(err);
            toast.error(
              err.response &&
                err.response.data.message &&
                err.response.data.message
            );
          });
        dispatch(fetchCart());
      }
    } else {
      localStorage.setItem("data-hold", JSON.stringify({type:"add-to-cart",...data}));
      loginPopupBoard.handlerPopup(true);
    }
  };

  //wishlist

  const { wishlistData } = useSelector((state) => state.wishlistData);
  const wishlist = wishlistData && wishlistData.wishlists;
  const wishlisted =
    wishlist && wishlist.data.find((id) => id.product.id === product.id);

  const [arWishlist, setArWishlist] = useState(null);
  useEffect(() => {
    if (wishlisted) {
      setArWishlist(true);
    } else {
      setArWishlist(false);
    }
  }, [wishlisted]);

  const addToWishlist = (id) => {
    if (auth()) {
      setArWishlist(true);
      apiRequest.addToWishlist({ id: id, token: auth().access_token });
      dispatch(fetchWishlist());
    } else {
      loginPopupBoard.handlerPopup(true);
    }
  };
  const removeToWishlist = (id) => {
    if (auth()) {
      setArWishlist(false);
      apiRequest.removeToWishlist({ id: id, token: auth().access_token });
      dispatch(fetchWishlist());
    } else {
      loginPopupBoard.handlerPopup(true);
    }
  };

  const { currency_icon } = settings();
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [pricePercent, setPricePercent] = useState("");
  useEffect(() => {
    if (websiteSetup) {
      const offerFlashSale = websiteSetup.payload.flashSale;
      const flashSaleProducts = websiteSetup.payload.flashSaleProducts;
      const isFlashSaleProduct = flashSaleProducts.find(
        (item) => parseInt(item.product_id) === product.id
      );
      if (isFlashSaleProduct) {
        const offer = parseInt(offerFlashSale.offer);
        const price = product.offer_price
          ? parseInt(product.offer_price)
          : parseInt(product.price);
        const discountPrice = (offer / 100) * price;
        const mainPrice = price - discountPrice;
        setPricePercent(
          Math.trunc(((mainPrice - product.price) / product.price) * 100)
        );
      } else {
        setPricePercent(
          Math.trunc(
            ((product.offer_price - product.price) / product.price) * 100
          )
        );
      }
    }
  }, [websiteSetup]);
  const popupMessageHandler = () =>{
    if(auth()){
      messageHandler.toggleHandler(seller)
    }else{
      loginPopupBoard.handlerPopup(true);
    }
  };

  return (
    <>
      <div
        className={`product-view w-full lg:flex justify-between ${
          className || ""
        }`}
      >
        <div
          data-aos="fade-right"
          className="lg:w-1/2 xl:mr-[70px] lg:mr-[50px]"
        >
          <div className="w-full">
            <div className="w-full md:h-[600px] h-[350px] border border-qgray-border flex justify-center items-center overflow-hidden relative mb-3 relative">
              <Image
                layout="fill"
                objectFit="scale-down"
                src={`${process.env.NEXT_PUBLIC_BASE_URL + src}`}
                alt=""
                className="object-contain  transform scale-110"
              />
              {product.offer_price && (
                <div className="w-[80px] h-[80px] rounded-full bg-qyellow text-qblack flex justify-center items-center text-xl font-medium absolute left-[30px] top-[30px]">
                  <span className="text-tblack">{pricePercent}%</span>
                  {/*<span>*/}
                  {/*  {product.id}*/}
                  {/*  {CheckProductIsExistsInFlashSale({*/}
                  {/*    id: 999999999999999,*/}
                  {/*    price: offerPrice,*/}
                  {/*  })}*/}
                  {/*</span>*/}
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <div
                onClick={() => changeImgHandler(product.thumb_image)}
                className="w-[110px] h-[110px] p-[15px] border border-qgray-border cursor-pointer relative"
              >
                <Image
                  layout="fill"
                  objectFit="scale-down"
                  src={`${
                    process.env.NEXT_PUBLIC_BASE_URL + product.thumb_image
                  }`}
                  alt=""
                  className={`w-full h-full object-contain transform scale-110 ${
                    src !== product.thumb_image ? "opacity-50" : ""
                  } `}
                />
              </div>
              {productsImg &&
                productsImg.length > 0 &&
                productsImg.map((img, i) => (
                  <div
                    onClick={() => changeImgHandler(img.image)}
                    key={i}
                    className="w-[110px] h-[110px] p-[15px] border border-qgray-border cursor-pointer relative"
                  >
                    <Image
                      layout="fill"
                      objectFit="scale-down"
                      src={`${process.env.NEXT_PUBLIC_BASE_URL + img.image}`}
                      alt=""
                      className={`w-full h-full object-contain ${
                        src !== img.image ? "opacity-50" : ""
                      } `}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="product-details w-full mt-10 lg:mt-0">
            {product.brand && (
              <span
                data-aos="fade-up"
                className="text-qgray text-xs font-normal uppercase tracking-wider mb-2 inline-block"
              >
                {product.brand.name}
              </span>
            )}

            <p
              data-aos="fade-up"
              className="text-xl font-medium text-qblack mb-4"
            >
              {product.name}
            </p>
            <div
              data-aos="fade-up"
              className="flex space-x-[10px] items-center mb-6"
            >
              <div className="flex">
                {/*{Array.from(Array(parseInt(product.averageRating)), () => (*/}
                {/*  <Star />*/}
                {/*))}*/}
                {Array.from(Array(parseInt(product.averageRating)), () => (
                  <span key={parseInt(product.averageRating) + Math.random()}>
                    <Star />
                  </span>
                ))}
                {parseInt(product.averageRating) < 5 && (
                  <>
                    {Array.from(
                      Array(5 - parseInt(product.averageRating)),
                      () => (
                        <span
                          key={parseInt(product.averageRating) + Math.random()}
                          className="text-gray-500"
                        >
                          <Star defaultValue={false} />
                        </span>
                      )
                    )}
                  </>
                )}
              </div>
              <span className="text-[13px] font-normal text-qblack">
                {parseInt(product.averageRating)} {ServeLangItem()?.Reviews}
              </span>
            </div>
            <div
              data-aos="fade-up"
              className="flex space-x-2 items-baseline mb-7"
            >
              <span
                suppressHydrationWarning
                className={`main-price  font-600  ${
                  offerPrice
                    ? "line-through text-qgray text-[15px]"
                    : "text-qred text-[24px]"
                }`}
              >
                {offerPrice ? (
                  <span>{currency_icon + price}</span>
                ) : (
                  <CheckProductIsExistsInFlashSale
                    id={product.id}
                    price={price}
                  />
                )}
              </span>
              {offerPrice && (
                <span
                  suppressHydrationWarning
                  className="offer-price text-qred font-600 text-[24px] ml-2"
                >
                  <CheckProductIsExistsInFlashSale
                    id={product.id}
                    price={offerPrice}
                  />
                </span>
              )}
            </div>

            <div data-aos="fade-up" className="mb-[30px]">
              <div
                className={`text-qgray text-sm text-normal  leading-7 ${
                  more ? "" : "line-clamp-2"
                }`}
              >
                {product.short_description}
              </div>
              <button
                onClick={() => setMore(!more)}
                type="button"
                className="text-blue-500 text-xs font-bold"
              >
                {more ? "See Less" : "See More"}
              </button>
            </div>
            <div className="p-3 bg-qyellowlow flex items-center space-x-2 mb-[30px] w-fit">
              <span className="text-base font-bold text-qblack">
                {ServeLangItem()?.Availability} :
              </span>
              <span className="text-base font-bold text-qyellow">
                {product.qty !== "0"
                  ? `${product.qty} Products Available`
                  : `Products not Available`}
              </span>
            </div>

            {/*<div data-aos="fade-up" className="colors mb-[30px]">*/}
            {/*  <span className="text-sm font-normal uppercase text-qgray mb-[14px] inline-block">*/}
            {/*    COLOR*/}
            {/*  </span>*/}

            {/*  <div className="flex space-x-4 items-center">*/}
            {/*    {productsImg &&*/}
            {/*      productsImg.length > 0 &&*/}
            {/*      productsImg.map((img) => (*/}
            {/*        <div key={img.id}>*/}
            {/*          {img.color && img.color !== "" && (*/}
            {/*            <button*/}
            {/*              onClick={() => changeImgHandler(img.src)}*/}
            {/*              type="button"*/}
            {/*              style={{ "--tw-ring-color": `${img.color}` }}*/}
            {/*              className="w-[20px] h-[20px]  rounded-full focus:ring-2  ring-offset-2 flex justify-center items-center"*/}
            {/*            >*/}
            {/*              <span*/}
            {/*                style={{ background: `${img.color}` }}*/}
            {/*                className="w-[20px] h-[20px] block rounded-full border"*/}
            {/*              ></span>*/}
            {/*            </button>*/}
            {/*          )}*/}
            {/*        </div>*/}
            {/*      ))}*/}
            {/*  </div>*/}
            {/*</div>*/}
            {varients.length > 0 &&
              varients.map((item) => (
                <div
                  key={item.id}
                  data-aos="fade-up"
                  className="product-size mb-[30px]"
                >
                  <span className="text-sm font-normal uppercase text-qgray mb-[14px] inline-block">
                    {item.name}
                  </span>
                  <div className="w-full">
                    <div className=" border border-qgray-border h-[50px] flex justify-between items-center px-6 cursor-pointer">
                      <Selectbox
                        action={selectVarient}
                        className="w-full"
                        datas={
                          item.active_variant_items &&
                          item.active_variant_items.length > 0 &&
                          item.active_variant_items
                        }
                      >
                        {({ item }) => (
                          <>
                            <div className="flex justify-between items-center w-full">
                              <div>
                                <span className="text-[13px] text-qblack">
                                  {item}
                                </span>
                              </div>
                              <span>
                                <svg
                                  width="11"
                                  height="7"
                                  viewBox="0 0 11 7"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.4 6.8L0 1.4L1.4 0L5.4 4L9.4 0L10.8 1.4L5.4 6.8Z"
                                    fill="#222222"
                                  />
                                </svg>
                              </span>
                            </div>
                            {/*<div className="flex space-x-10 items-center">*/}
                            {/*<span className="text-[13px] text-qblack">*/}
                            {/*  3”W x 3”D x 7”H*/}
                            {/*</span>*/}
                            {/*  */}
                            {/*</div>*/}
                          </>
                        )}
                      </Selectbox>
                    </div>
                  </div>
                </div>
              ))}

            <div
              data-aos="fade-up"
              className="quantity-card-wrapper w-full flex items-center h-[50px] space-x-[10px] mb-[30px]"
            >
              <div className="w-[120px] h-full px-[26px] flex items-center border border-qgray-border">
                <div className="flex justify-between items-center w-full">
                  <button
                    onClick={decrement}
                    type="button"
                    className="text-base text-qgray"
                  >
                    -
                  </button>
                  <span className="text-qblack">{quantity}</span>
                  <button
                    onClick={increment}
                    type="button"
                    className="text-base text-qgray"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="w-[60px] h-full flex justify-center items-center border border-qgray-border">
                {/*<button type="button">*/}
                {/*  <span>*/}
                {/*    <svg*/}
                {/*        width="24"*/}
                {/*        height="24"*/}
                {/*        viewBox="0 0 24 24"*/}
                {/*        fill="none"*/}
                {/*        xmlns="http://www.w3.org/2000/svg"*/}
                {/*    >*/}
                {/*      <path*/}
                {/*          d="M17 1C14.9 1 13.1 2.1 12 3.7C10.9 2.1 9.1 1 7 1C3.7 1 1 3.7 1 7C1 13 12 22 12 22C12 22 23 13 23 7C23 3.7 20.3 1 17 1Z"*/}
                {/*          stroke="#D5D5D5"*/}
                {/*          strokeWidth="2"*/}
                {/*          strokeMiterlimit="10"*/}
                {/*          strokeLinecap="square"*/}
                {/*      />*/}
                {/*    </svg>*/}
                {/*  </span>*/}
                {/*</button>*/}
                {!arWishlist ? (
                  <button
                    type="button"
                    onClick={() => addToWishlist(product.id)}
                  >
                    <span className="w-10 h-10 flex justify-center items-center">
                      <ThinLove />
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      removeToWishlist(wishlisted && wishlisted.id)
                    }
                  >
                    <span className="w-10 h-10 flex justify-center items-center">
                      <ThinLove fill={true} />
                    </span>
                  </button>
                )}
              </div>
              <div className="flex-1 h-full">
                <button
                  onClick={addToCard}
                  type="button"
                  className="black-btn text-sm font-semibold w-full h-full"
                >
                  {ServeLangItem()?.Add_To_Cart}
                </button>
              </div>
            </div>

            <div data-aos="fade-up" className="mb-[20px]">
              <p className="text-[13px] text-qgray leading-7">
                <span className="text-qblack">Category :</span>{" "}
                {product.category.name}
              </p>
              {tags && (
                <p className="text-[13px] text-qgray leading-7">
                  <span className="text-qblack">Tags:</span>{" "}
                  {tags.length > 0 &&
                    tags.map((item, i) => (
                      <span key={i}>{item.value + ", "}</span>
                    ))}
                </p>
              )}
              <p className="text-[13px] text-qgray leading-7">
                <span className="text-qblack uppercase">
                  {ServeLangItem()?.SKU}:
                </span>{" "}
                {product.sku}
              </p>
            </div>

            <div
              data-aos="fade-up"
              className="flex space-x-2 items-center mb-[20px] report-btn "
            >
              <span>
                <svg
                  width="12"
                  height="13"
                  viewBox="0 0 12 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0C0.247634 0 0.475436 0 0.729172 0C0.738324 0.160174 0.747477 0.316279 0.757647 0.493233C1.05816 0.392044 1.33885 0.282211 1.62818 0.203395C3.11296 -0.201361 4.51385 0.0366111 5.84202 0.779512C6.47661 1.13494 7.14171 1.39071 7.86987 1.47207C8.88125 1.58496 9.82093 1.35817 10.7098 0.88426C10.9335 0.765274 11.1522 0.636627 11.411 0.491199C11.4161 0.606117 11.4237 0.693577 11.4237 0.780529C11.4242 3.18822 11.4222 5.5954 11.4288 8.00309C11.4293 8.1892 11.3718 8.29089 11.2096 8.38039C9.31956 9.42279 7.4285 9.43499 5.54557 8.37734C4.06231 7.54443 2.55363 7.43307 0.992568 8.13835C0.804428 8.22327 0.737816 8.33005 0.739341 8.53904C0.749003 9.9206 0.744426 11.3027 0.744426 12.6842C0.744426 12.7849 0.744426 12.8851 0.744426 13C0.48764 13 0.254244 13 0 13C0 8.67582 0 4.34961 0 0Z"
                    fill="#EB5757"
                  />
                </svg>
              </span>

              <button
                type="button"
                onClick={reportHandler}
                className="text-qred font-semibold text-[13px]"
              >
                {ServeLangItem()?.Report_This_Item}
              </button>
            </div>

            <div
              data-aos="fade-up"
              className="social-share flex  items-center w-full mb-[20px]"
            >
              <span className="text-qblack text-[13px] mr-[17px] inline-block">
                {ServeLangItem()?.Share_This}
              </span>

              <div className="flex space-x-5 items-center">
                <FacebookShareButton
                  url={`${
                    typeof window !== "undefined" &&
                    window.location.origin &&
                    window.location.origin +
                      "/single-product?slug=" +
                      product.slug
                  }`}
                  quotes={product.name}
                >
                  <span className="cursor-pointer">
                    <svg
                      width="10"
                      height="16"
                      viewBox="0 0 10 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 16V9H0V6H3V4C3 1.3 4.7 0 7.1 0C8.3 0 9.2 0.1 9.5 0.1V2.9H7.8C6.5 2.9 6.2 3.5 6.2 4.4V6H10L9 9H6.3V16H3Z"
                        fill="#3E75B2"
                      />
                    </svg>
                  </span>
                </FacebookShareButton>
                <TwitterShareButton
                  url={`${
                    typeof window !== "undefined" &&
                    window.location.origin &&
                    window.location.origin +
                      "/single-product?slug=" +
                      product.slug
                  }`}
                  title={product.name}
                >
                  <span className="cursor-pointer">
                    <svg
                      width="18"
                      height="14"
                      viewBox="0 0 18 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.0722 1.60052C16.432 1.88505 15.7562 2.06289 15.0448 2.16959C15.7562 1.74278 16.3253 1.06701 16.5742 0.248969C15.8985 0.640206 15.1515 0.924742 14.3335 1.10258C13.6933 0.426804 12.7686 0 11.7727 0C9.85206 0 8.28711 1.56495 8.28711 3.48557C8.28711 3.7701 8.32268 4.01907 8.39382 4.26804C5.51289 4.12577 2.9165 2.73866 1.17371 0.604639C0.889175 1.13814 0.71134 1.70722 0.71134 2.34742C0.71134 3.5567 1.31598 4.62371 2.27629 5.26392C1.70722 5.22835 1.17371 5.08608 0.675773 4.83711V4.87268C0.675773 6.5799 1.88505 8.00258 3.48557 8.32268C3.20103 8.39382 2.88093 8.42938 2.56082 8.42938C2.34742 8.42938 2.09845 8.39382 1.88505 8.35825C2.34742 9.74536 3.62784 10.7768 5.15722 10.7768C3.94794 11.7015 2.45412 12.2706 0.818041 12.2706C0.533505 12.2706 0.248969 12.2706 0 12.2351C1.56495 13.2309 3.37887 13.8 5.37062 13.8C11.8082 13.8 15.3294 8.46495 15.3294 3.84124C15.3294 3.69897 15.3294 3.52113 15.3294 3.37887C16.0052 2.9165 16.6098 2.31186 17.0722 1.60052Z"
                        fill="#3FD1FF"
                      />
                    </svg>
                  </span>
                </TwitterShareButton>
                {/*<Link href="#">*/}
                {/*  <span className="cursor-pointer">*/}
                {/*    <svg*/}
                {/*      width="16"*/}
                {/*      height="16"*/}
                {/*      viewBox="0 0 16 16"*/}
                {/*      fill="none"*/}
                {/*      xmlns="http://www.w3.org/2000/svg"*/}
                {/*    >*/}
                {/*      <path*/}
                {/*        d="M8 0C3.6 0 0 3.6 0 8C0 11.4 2.1 14.3 5.1 15.4C5 14.8 5 13.8 5.1 13.1C5.2 12.5 6 9.1 6 9.1C6 9.1 5.8 8.7 5.8 8C5.8 6.9 6.5 6 7.3 6C8 6 8.3 6.5 8.3 7.1C8.3 7.8 7.9 8.8 7.6 9.8C7.4 10.6 8 11.2 8.8 11.2C10.2 11.2 11.3 9.7 11.3 7.5C11.3 5.6 9.9 4.2 8 4.2C5.7 4.2 4.4 5.9 4.4 7.7C4.4 8.4 4.7 9.1 5 9.5C5 9.7 5 9.8 5 9.9C4.9 10.2 4.8 10.7 4.8 10.8C4.8 10.9 4.7 11 4.5 10.9C3.5 10.4 2.9 9 2.9 7.8C2.9 5.3 4.7 3 8.2 3C11 3 13.1 5 13.1 7.6C13.1 10.4 11.4 12.6 8.9 12.6C8.1 12.6 7.3 12.2 7.1 11.7C7.1 11.7 6.7 13.2 6.6 13.6C6.4 14.3 5.9 15.2 5.6 15.7C6.4 15.9 7.2 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0Z"*/}
                {/*        fill="#E12828"*/}
                {/*      />*/}
                {/*    </svg>*/}
                {/*  </span>*/}
                {/*</Link>*/}
              </div>

            </div>
            {seller && (
                <div data-aos="fade-up" className="message-btn">
                  <button onClick={()=>popupMessageHandler()} className="flex px-5 py-2 bg-qyellow text-qblack items-center space-x-2.5" type="button">
                <span>
                  <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.30898 18.0944C0.962386 18.0925 0.630508 17.954 0.385424 17.7089C0.14034 17.4638 0.00183875 17.132 0 16.7854V6.01951C0.00184787 5.30162 0.287849 4.61366 0.795479 4.10603C1.30311 3.5984 1.99107 3.31239 2.70897 3.31055H15.4838C16.2029 3.31054 16.8927 3.59573 17.4018 4.10356C17.9109 4.61139 18.1979 5.30041 18.1998 6.01951V13.1944C18.1998 13.9135 17.9146 14.6033 17.4068 15.1124C16.8989 15.6216 16.2099 15.9085 15.4908 15.9104H4.83694C4.71593 15.9114 4.59833 15.9506 4.50094 16.0224L2.09997 17.8354C1.87104 18.0045 1.59364 18.0954 1.30898 18.0944ZM2.70897 4.71053C2.36237 4.71237 2.03049 4.85087 1.78541 5.09595C1.54032 5.34104 1.40182 5.67291 1.39998 6.01951V16.6104L3.66095 14.9024C4.00115 14.6497 4.41318 14.5124 4.83694 14.5104H15.4838C15.8328 14.5104 16.1675 14.3718 16.4143 14.125C16.6611 13.8782 16.7998 13.5434 16.7998 13.1944V6.01951C16.7979 5.67291 16.6594 5.34104 16.4144 5.09595C16.1693 4.85087 15.8374 4.71237 15.4908 4.71053H2.70897Z" fill="black"></path><path d="M11.8601 10.3746C12.2467 10.3746 12.5601 10.0612 12.5601 9.6746C12.5601 9.28801 12.2467 8.97461 11.8601 8.97461C11.4736 8.97461 11.1602 9.28801 11.1602 9.6746C11.1602 10.0612 11.4736 10.3746 11.8601 10.3746Z" fill="black"></path><path d="M9.1414 10.3746C9.52799 10.3746 9.84139 10.0612 9.84139 9.6746C9.84139 9.28801 9.52799 8.97461 9.1414 8.97461C8.7548 8.97461 8.44141 9.28801 8.44141 9.6746C8.44141 10.0612 8.7548 10.3746 9.1414 10.3746Z" fill="black"></path><path d="M6.34062 10.3746C6.72721 10.3746 7.04061 10.0612 7.04061 9.6746C7.04061 9.28801 6.72721 8.97461 6.34062 8.97461C5.95402 8.97461 5.64062 9.28801 5.64062 9.6746C5.64062 10.0612 5.95402 10.3746 6.34062 10.3746Z" fill="black"></path><path d="M20.2998 11.0116C20.1141 11.0116 19.9361 10.9378 19.8048 10.8066C19.6735 10.6753 19.5998 10.4972 19.5998 10.3116V3.22068C19.598 2.87409 19.4595 2.54221 19.2144 2.29712C18.9693 2.05204 18.6374 1.91354 18.2908 1.9117H4.19999C4.01434 1.9117 3.8363 1.83795 3.70502 1.70668C3.57375 1.5754 3.5 1.39736 3.5 1.21171C3.5 1.02606 3.57375 0.848015 3.70502 0.716741C3.8363 0.585468 4.01434 0.511719 4.19999 0.511719H18.2908C19.0087 0.513567 19.6967 0.799568 20.2043 1.3072C20.7119 1.81483 20.9979 2.50279 20.9998 3.22068V10.3116C20.9998 10.4972 20.926 10.6753 20.7948 10.8066C20.6635 10.9378 20.4854 11.0116 20.2998 11.0116Z" fill="black"></path></svg>
                </span>
                    <span className="text-base font-medium text-qblack capitalize">
                  Chat with seller
                </span>
                  </button>
                </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

//store all varient

// store all varient first item
