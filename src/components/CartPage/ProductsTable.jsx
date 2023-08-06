import Image from "next/image";
import { useEffect, useState } from "react";
import settings from "../../../utils/settings";
import InputQuantityCom from "../Helpers/InputQuantityCom";
import CheckProductIsExistsInFlashSale from "../Shared/CheckProductIsExistsInFlashSale";
import Link from "next/link";
import ServeLangItem from "../Helpers/ServeLangItem";

export default function ProductsTable({
  className,
  cartItems,
  deleteItem,
  calCPriceDependQunatity,
  incrementQty,
  decrementQty,
}) {
  const [storeCarts, setItems] = useState(null);
  const price = (item) => {
    if (item) {
      if (item.product.offer_price) {
        if (item.variants && item.variants.length > 0) {
          const prices = item.variants.map((item) =>
            item.variant_item ? parseInt(item.variant_item.price) : 0
          );
          const sumVarient = prices.reduce((p, c) => p + c);
          return parseInt(item.product.offer_price) + sumVarient;
        } else {

          return item.product.offer_price;
        }
      } else {
        if (item.variants && item.variants.length > 0) {
          const prices = item.variants.map((item) =>
            item.variant_item ? parseInt(item.variant_item.price) : 0
          );
          const sumVarient = prices.reduce((p, c) => p + c);
          return parseInt(item.product.price) + sumVarient;
        } else {
          return item.product.price;
        }
      }
    }
  };
  const totalPriceCalc = (item) => {
    if (item) {
      const prices =
        item.variants.length > 0
          ? item.variants.map((item) =>
              item.variant_item ? parseInt(item.variant_item.price) : 0
            )
          : false;
      const sumVarient = prices ? prices.reduce((p, c) => p + c) : false;
      if (sumVarient) {
        const priceWithQty = sumVarient * parseInt(item.qty);
        return parseInt(item.totalPrice) + priceWithQty;
      } else {
        return item.totalPrice * 1;
      }
    }
  };
  useEffect(() => {
    setItems(cartItems);
  });
  const { currency_icon } = settings();
  return (
    <div className={`w-full ${className || ""}`}>
      <div className="relative w-full overflow-x-auto border border-[#EDEDED]">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <tbody>
            {/* table heading */}
            <tr className="text-[13px] font-medium text-black bg-[#F6F6F6] whitespace-nowrap px-2 border-b default-border-bottom uppercase">
              <td className="py-4 pl-10 block whitespace-nowrap min-w-[300px]">
                {ServeLangItem()?.Product}
              </td>
              <td className="py-4 whitespace-nowrap text-center">{ServeLangItem()?.Price}</td>
              <td className="py-4 whitespace-nowrap  text-center">{ServeLangItem()?.quantity}</td>
              <td className="py-4 whitespace-nowrap  text-center">{ServeLangItem()?.total}</td>
              <td className="py-4 whitespace-nowrap text-right w-[114px]"></td>
            </tr>
            {/* table heading end */}
            {storeCarts &&
              storeCarts.length > 0 &&
              storeCarts.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="pl-10  py-4  w-[380px]">
                    <div className="flex space-x-6 items-center">
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
                        <Link
                            href={{
                              pathname: "/single-product",
                              query: { slug: item.product.slug },
                            }}
                        >
                          <p className="font-medium text-[15px] text-qblack hover:text-blue-500 cursor-pointer">
                            {item.product.name}
                          </p>
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-2">
                    <div className="flex space-x-1 items-center justify-center">
                      <span className="text-[15px] font-normal">
                       <CheckProductIsExistsInFlashSale
                           id={item.product_id}
                           price={price(item)}
                       />
                      </span>
                    </div>
                  </td>
                  <td className=" py-4">
                    <div className="flex justify-center items-center">
                      <InputQuantityCom
                        decrementQty={decrementQty}
                        incrementQty={incrementQty}
                        calcTotalPrice={calCPriceDependQunatity}
                        productId={item.product.id}
                        cartId={item.id}
                        qyt={parseInt(item.qty)}
                      />
                    </div>
                  </td>
                  <td className="text-right py-4">
                    <div className="flex space-x-1 items-center justify-center">
                      <span className="text-[15px] font-normal">
                        <CheckProductIsExistsInFlashSale
                          id={item.product_id}
                          price={totalPriceCalc(item)}
                        />
                        {/*{totalPriceCalc(item)}*/}
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-4">
                    <div className="flex space-x-1 items-center justify-center">
                      <span
                        onClick={() => deleteItem(item.id)}
                        className="cursor-pointer"
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
  );
}
