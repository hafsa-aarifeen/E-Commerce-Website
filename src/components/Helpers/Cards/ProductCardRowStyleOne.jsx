import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiRequest from "../../../../utils/apiRequest";
import auth from "../../../../utils/auth";
import settings from "../../../../utils/settings";
import { fetchCart } from "../../../store/Cart";
import { fetchCompareProducts } from "../../../store/compareProduct";
import { fetchWishlist } from "../../../store/wishlistData";
import CheckProductIsExistsInFlashSale from "../../Shared/CheckProductIsExistsInFlashSale";
import ProductView from "../../SingleProductPage/ProductView";
import Compair from "../icons/Compair";
import QuickViewIco from "../icons/QuickViewIco";
import Star from "../icons/Star";
import ThinLove from "../icons/ThinLove";
import ServeLangItem from "../ServeLangItem";
import LoginContext from "../../Contexts/LoginContext";
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
export default function ProductCardRowStyleOne({ className, datas }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { wishlistData } = useSelector((state) => state.wishlistData);
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [isProductInFlashSale, setData] = useState(null);
  const loginPopupBoard = useContext(LoginContext);
  useEffect(() => {
    if (websiteSetup) {
      const getId = websiteSetup.payload.flashSaleProducts.find(
        (item) => parseInt(item.product_id) === parseInt(datas.id)
      );
      if (getId) {
        setData(true);
      } else {
        setData(false);
      }
    }
  }, [websiteSetup]);
  const wishlist = wishlistData && wishlistData.wishlists;
  const wishlisted =
    wishlist && wishlist.data.find((id) => id.product.id === datas.id);
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
  //cart
  const varients = datas && datas.variants.length > 0 && datas.variants;
  const [getFirstVarients, setFirstVarients] = useState(
    varients && varients.map((v) => v.active_variant_items[0])
  );
  const [price, setPrice] = useState(null);
  const [offerPrice, setOffer] = useState(null);
  const addToCart = (id) => {
    const data = {
      id: id,
      token: auth() && auth().access_token,
      quantity: 1,
      variants:
          getFirstVarients &&
          getFirstVarients.length > 0 &&
          getFirstVarients.map((v) =>
              v ? parseInt(v.product_variant_id) : null
          ),
      variantItems:
          getFirstVarients &&
          getFirstVarients.length > 0 &&
          getFirstVarients.map((v) => (v ? v.id : null)),
    };
    if (auth()) {
      if (varients) {
        const variantQuery = data.variants.map((value, index) => {
          return value ? `variants[]=${value}` : `variants[]=-1`;
        });
        const variantString = variantQuery.map((value) => value + "&").join("");

        const itemsQuery = data.variantItems.map((value, index) => {
          return value ? `items[]=${value}` : `items[]=-1`;
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
          .catch((err) => {
            toast.error(
              err.response &&
                err.response.data.message &&
                err.response.data.message
            );
          });
        dispatch(fetchCart());
      } else {
        const uri = `token=${data.token}&product_id=${data.id}&quantity=${data.quantity}`;
        apiRequest
          .addToCard(uri)
          .then((res) =>
            toast.success(<Redirect />, {
              autoClose: 5000,
            })
          )
          .catch((err) => {
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
  useEffect(() => {
    if (varients) {
      const prices = varients.map((v) =>
        v.active_variant_items.length > 0 && v.active_variant_items[0].price
          ? v.active_variant_items[0].price
          : 0
      );

      if (datas.offer_price) {
        const sumOfferPrice = parseFloat(
          prices.reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0) +
            parseFloat(datas.offer_price)
        );
        setPrice(datas.price);
        setOffer(sumOfferPrice);
      } else {
        const sumPrice = parseFloat(
          prices.reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0) +
            parseFloat(datas.price)
        );
        setPrice(sumPrice);
      }
    } else {
      setPrice(datas && datas.price);
      setOffer(datas && datas.offer_price);
    }
  }, [datas, varients]);
  const { currency_icon } = settings();
  /*compare product feature
   * add product for compare method
   * @params (id,token)
   * request method is (apiRequest)
   * */
  const productCompare = (id) => {
    if (auth()) {
      apiRequest
        .addProductForCompare(id, auth().access_token)
        .then((res) => {
          toast.success(res.data && res.data.notification);
          dispatch(fetchCompareProducts());
        })
        .catch((err) => {
          toast.error(err.response && err.response.data.notification);
          console.log(err);
        });
    } else {
      loginPopupBoard.handlerPopup(true);
    }
  };
  //quick view feature
  const [quickViewModal, setQuickView] = useState(false);
  const [quickViewData, setQuickViewData] = useState(null);
  const quickViewHandler = (slug) => {
    setQuickView(!quickViewModal);
    if (!quickViewData) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/product/${slug}`)
        .then((res) => {
          setQuickViewData(res.data ? res.data : null);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    if (quickViewModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [quickViewModal]);
  return (
    <div className="main-wrapper-card relative">
      <div
        data-aos="fade-left"
        className={`product-row-card-style-one  w-full lg:h-[250px] h-[200px] bg-white group relative overflow-hidden ${
          className || ""
        }`}
      >
        <div className="flex space-x-5 items-center w-full h-full lg:p-[30px] sm:p-5 p-2">
          <div className="lg:w-1/2 w-1/3 h-full relative transform scale-100 group-hover:scale-110 transition duration-300 ease-in-ou">
            <Image
              layout="fill"
              objectFit="scale-down"
              src={`${datas.image}`}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center h-full">
            <div>
              {/* reviews */}
              <div className="flex space-x-1 mb-3">
                {Array.from(Array(datas.review), () => (
                  <span key={datas.review + Math.random()}>
                    <Star />
                  </span>
                ))}
                {datas.review < 5 && (
                  <>
                    {Array.from(Array(5 - datas.review), () => (
                      <span
                        key={datas.review + Math.random()}
                        className="text-gray-500"
                      >
                        <Star defaultValue={false} />
                      </span>
                    ))}
                  </>
                )}
              </div>

              <Link
                href={{
                  pathname: "/single-product",
                  query: { slug: datas.slug },
                }}
                passHref
              >
                <a rel="noopener noreferrer">
                  <p className="title mb-2 sm:text-[15px] text-[13px] font-600 text-qblack leading-[24px] line-clamp-2 hover:text-blue-600 cursor-pointer">
                    {datas.title}
                  </p>
                </a>
              </Link>
              <p className="price mb-[26px]">
                <span
                  suppressHydrationWarning
                  className={`main-price  font-600 text-[18px] ${
                    offerPrice ? "line-through text-qgray" : "text-qred"
                  }`}
                >
                  {offerPrice ? (
                    <span>{currency_icon && currency_icon + price}</span>
                  ) : (
                    <>
                      {isProductInFlashSale && (
                        <span
                          className={`line-through text-qgray font-500 text-[16px] mr-2`}
                        >
                          {currency_icon &&
                            currency_icon + parseFloat(price).toFixed(2)}
                        </span>
                      )}
                      <CheckProductIsExistsInFlashSale
                        id={datas.id}
                        price={price}
                      />
                    </>
                  )}
                </span>
                {offerPrice && (
                  <span
                    suppressHydrationWarning
                    className="offer-price text-qred font-600 text-[18px] ml-2"
                  >
                    <CheckProductIsExistsInFlashSale
                      id={datas.id}
                      price={offerPrice}
                    />
                  </span>
                )}
              </p>
              <button
                onClick={() => addToCart(datas.id)}
                type="button"
                className="w-[110px] h-[30px]"
              >
                <span className="yellow-btn">
                  {ServeLangItem()?.Add_To_Cart}
                </span>
              </button>
            </div>
          </div>
        </div>
        {/* quick-access-btns */}
        <div className="quick-access-btns flex flex-col space-y-2">
          <button
            className=" absolute group-hover:left-4 -left-10 top-5  transition-all ease-in-out"
            type="button"
            onClick={() => quickViewHandler(datas.slug)}
          >
            <span className="w-10 h-10 flex justify-center text-black hover:text-white items-center transition-all duration-300 ease-in-out hover:bg-qyellow bg-primarygray rounded">
              <QuickViewIco className="fill-current" />
            </span>
          </button>
          {!arWishlist ? (
            <button
              className=" absolute group-hover:left-4 -left-10 top-[60px] duration-300   transition-all ease-in-out"
              type="button"
              onClick={() => addToWishlist(datas.id)}
            >
              <span className="w-10 h-10 flex text-black hover:text-white justify-center items-center transition-all duration-300 ease-in-out hover:bg-qyellow bg-primarygray rounded">
                <ThinLove className="fill-current" />
              </span>
            </button>
          ) : (
            <button
              className=" absolute group-hover:left-4 -left-10 top-[60px] duration-300   transition-all ease-in-out"
              type="button"
              onClick={() => removeToWishlist(wishlisted && wishlisted.id)}
            >
              <span className="w-10 h-10 flex justify-center items-center bg-primarygray rounded">
                <ThinLove fill={true} />
              </span>
            </button>
          )}
          <button
            className=" absolute group-hover:left-4 -left-10 top-[107px]  transition-all duration-500 ease-in-out"
            type="button"
            onClick={() => productCompare(datas.id)}
          >
            <span className="w-10 h-10 flex justify-center text-black hover:text-white transition-all duration-300 ease-in-out items-center hover:bg-qyellow bg-primarygray rounded">
              <Compair />
            </span>
          </button>
        </div>
        {quickViewModal && quickViewData && (
          <div className="quicke-view-wrapper w-full h-full flex fixed left-0 top-0 justify-center z-50 items-center ">
            <div
              onClick={() => setQuickView(!quickViewModal)}
              className="w-full h-full fixed left-0 right-0 bg-black  bg-opacity-25"
            ></div>
            <div
              data-aos="fade-up"
              className="md:mx-10 xl:mt-[100px] rounded w-full bg-white relative lg:py-[40px] pt-[80px] pb-[40px] sm:px-[38px] px-3 md:mt-12 h-full overflow-y-scroll xl:overflow-hidden xl:mt-0 "
              style={{ zIndex: "999" }}
            >
              <div className="w-full h-full overflow-y-scroll overflow-style-none">
                <ProductView
                  images={
                    quickViewData.gellery.length > 0
                      ? quickViewData.gellery
                      : []
                  }
                  product={quickViewData.product}
                />
              </div>
              <button
                onClick={() => setQuickView(!quickViewModal)}
                type="button"
                className="absolute right-3 top-3"
              >
                <span className="text-red-500 w-12 h-12 flex justify-center items-center rounded border border-qred">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
      <span className="anim bottom"></span>
      <span className="anim right"></span>
      <span className="anim top"></span>
      <span className="anim left"></span>
    </div>
  );
}
