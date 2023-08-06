import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiRequest from "../../../../../utils/apiRequest";
import auth from "../../../../../utils/auth";
import settings from "../../../../../utils/settings";
import { fetchWishlist } from "../../../../store/wishlistData";
import ServeLangItem from "../../../Helpers/ServeLangItem";

export default function WishlistTab({ className }) {
  const dispatch = useDispatch();
  const { wishlistData } = useSelector((state) => state.wishlistData);
  const wishlists = wishlistData && wishlistData.wishlists;
  const clearList = () => {
    if (auth()) {
      apiRequest
        .clearWishlist({
          token: auth().access_token,
        })
        .then(() => {
          toast.success(ServeLangItem()?.Clear_wishlist);
          dispatch(fetchWishlist());
        });
    }
    return false;
  };
  const [mainProduct, setMainProducts] = useState(null);
  // const calcTotalPrice = (id, qyt) => {
  //   setMainProducts(
  //     mainProduct &&
  //       mainProduct.map((obj) => {
  //         if (obj.product.id === id) {
  //           return {
  //             ...obj,
  //             totalPrice: obj.product.price * qyt,
  //           };
  //         }
  //         return obj;
  //       })
  //   );
  // };
  useEffect(() => {
    if (wishlists) {
      setMainProducts(
        wishlists &&
          wishlists.data.map((item) => {
            return {
              ...item,
              totalPrice: item.product.price,
            };
          })
      );
    } else {
      setMainProducts(null);
    }
  }, [wishlists]);

  const removeToWishlist = (id) => {
    if (auth()) {
      apiRequest.removeToWishlist({ id: id, token: auth().access_token });
      dispatch(fetchWishlist());
    } else {
      return false;
    }
  };
  const { currency_icon } = settings();
  return (
    <>
      <div className={`w-full ${className || ""}`}>
        <div className="relative w-full overflow-x-auto border border-[#EDEDED]">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody>
              {/* table heading */}
              <tr className="text-[13px] font-medium text-black bg-[#F6F6F6] whitespace-nowrap px-2 border-b default-border-bottom uppercase">
                <td className="py-4 ltr:pl-10 rtl:pr-10 block whitespace-nowrap">
                  {ServeLangItem()?.Product}
                </td>

                <td className="py-4 whitespace-nowrap text-center">
                  {ServeLangItem()?.Price}
                </td>

                <td className="py-4 whitespace-nowrap text-center block">
                  {ServeLangItem()?.Action}
                </td>
              </tr>
              {/*table heading end*/}
              {mainProduct &&
                mainProduct.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="ltr:pl-10 rtl:pr-10  py-4  w-[380px] ">
                      <div className="flex space-x-6 rtl:space-x-reverse items-center">
                        <div className="w-[80px] h-[80px] overflow-hidden flex justify-center items-center border border-[#EDEDED] relative">
                          <Image
                            layout="fill"
                            src={`${
                              process.env.NEXT_PUBLIC_BASE_URL +
                              item.product.thumb_image
                            }`}
                            alt="product"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <p className="font-medium text-[15px] text-qblack">
                            {item.product.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="text-center py-4 px-2">
                      <div className="flex space-x-1 rtl:space-x-reverse items-center justify-center">
                        <span
                          suppressHydrationWarning
                          className="text-[15px] font-normal"
                        >
                          {currency_icon
                            ? currency_icon + item.product.price
                            : item.product.price}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-4">
                      <div className="flex space-x-1 rtl:space-x-reverse items-center justify-center">
                        <span
                          className="cursor-pointer"
                          onClick={() => removeToWishlist(item.id)}
                        >
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.7 0.3C9.3 -0.1 8.7 -0.1 8.3 0.3L5 3.6L1.7 0.3C1.3 -0.1 0.7 -0.1 0.3 0.3C-0.1 0.7 -0.1 1.3 0.3 1.7L3.6 5L0.3 8.3C-0.1 8.7 -0.1 9.3 0.3 9.7C0.7 10.1 1.3 10.1 1.7 9.7L5 6.4L8.3 9.7C8.7 10.1 9.3 10.1 9.7 9.7C10.1 9.3 10.1 8.7 9.7 8.3L6.4 5L9.7 1.7C10.1 1.3 10.1 0.7 9.7 0.3Z"
                              fill="#AAAAAA"
                            />
                          </svg>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full mt-[30px] flex sm:justify-end justify-start">
        <div className="sm:flex sm:space-x-[30px] rtl:space-x-reverse items-center">
          <button onClick={clearList} type="button">
            <div className="w-full text-sm font-semibold text-qred mb-5 sm:mb-0">
              {ServeLangItem()?.Clean_Wishlist}
            </div>
          </button>
          <Link href="/cart">
            <div className="w-[180px] h-[50px]">
              <div className="yellow-btn flex justify-center">
                <span className="w-full text-sm font-semibold text-center">
                  {ServeLangItem()?.View_Cards}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
