import React from "react";
import Link from "next/dist/client/link";
import ServeLangItem from "../../Helpers/ServeLangItem";

function OneColumnAdsTwo({ data }) {
  return (
    <div className={`one-column-ads-one sm:h-[166px] h-[100px] w-full`}>
      <div
        data-aos="fade-right"
        style={{
          backgroundImage: `url(${
            process.env.NEXT_PUBLIC_BASE_URL + data.image
          })`,
          backgroundSize: `cover`,
          backgroundRepeat: `no-repeat`,
        }}
        className="w-full h-full flex justify-center items-center ltr:md:pl-[80px] rtl:md:pr-[80px] ltr:pl-3 rtl:pr-3 md:py-[40px] py-4 group"
      >
        <div className="w-full h-full flex flex-col justify-evenly">
          <div>
            <div className="">
              <h1 className="md:text-[30px] text-[20px] md:leading-[40px] font-semibold">
                {data.title_one}
              </h1>
            </div>
          </div>
          <div className="w-[90px]">
            <Link
              href={{
                pathname: "/products",
                query: { category: data.product_slug },
              }}
              passHref
            >
              <a rel="noopener noreferrer">
                <div className="cursor-pointer w-full relative">
                  <div className="inline-flex text-qred rtl:space-x-reverse  space-x-1.5 items-center relative z-20">
                    <span className="text-sm  font-semibold leading-[30px]">
                      {ServeLangItem()?.Shop_Now}
                    </span>
                    <span className="leading-[30px]">
                      <svg
                        width="7"
                        height="11"
                        viewBox="0 0 7 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current transform rtl:rotate-180"
                      >
                        <rect
                          x="2.08984"
                          y="0.636719"
                          width="6.94219"
                          height="1.54271"
                          transform="rotate(45 2.08984 0.636719)"
                        />
                        <rect
                          x="7"
                          y="5.54492"
                          width="6.94219"
                          height="1.54271"
                          transform="rotate(135 7 5.54492)"
                        />
                      </svg>
                    </span>
                  </div>
                  <div className="w-[82px] transition-all duration-300 ease-in-out group-hover:h-4 h-[0px] bg-qyellow absolute left-0 rtl:right-0 bottom-0 z-10"></div>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OneColumnAdsTwo;
