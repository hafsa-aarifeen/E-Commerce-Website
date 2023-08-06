import React from "react";
import Link from "next/dist/client/link";
import ServeLangItem from "../../Helpers/ServeLangItem";

function OneColumnAdsOne({ data }) {
  return (
    <div
      className={`one-column-ads-one md:h-[295px] h-[190px] md:mb-[60px] mb-[30px] w-full`}
    >
      <div className="container-x mx-auto h-full">
        <div
          data-aos="fade-right"
          style={{
            backgroundImage: `url(${
              process.env.NEXT_PUBLIC_BASE_URL + data.image
            })`,
            backgroundSize: `cover`,
            backgroundRepeat: `no-repeat`,
          }}
          className="w-full h-full flex  justify-center items-center xl:py-[60px] md:py-[40px] py-4 group"
        >
          <div className="w-full h-full flex flex-col justify-between items-center">
            <div>
              <div className="md:mb-3 text-center">
                <span className="text-qblack uppercase text-xs font-semibold">
                  {data.title_one}
                </span>
              </div>
              <div className="flex justify-center">
                <h1 className="w-[300px] md:text-[30px] text-[20px] md:leading-[40px] leading-1 text-qblack font-semibold text-center">
                  {data.title_two}
                </h1>
              </div>
            </div>
            <div>
              <Link
                href={{
                  pathname: "/products",
                  query: { category: data.product_slug },
                }}
                passHref
              >
                <a rel="noopener noreferrer">
                  <div className="w-[136px] h-[40px] bg-white relative flex justify-center overflow-hidden">
                    <div className="w-full h-full bg-qyellow absolute transition-all duration-300 ease-in-out -left-[140px] group-hover:left-0 top-0"></div>
                    <div className="flex space-x-2 rtl:space-x-reverse items-center relative z-10">
                      <span className="text-sm text-semibold transition-all duration-300 ease-in-out text-qyellow group-hover:text-qblack">
                        {ServeLangItem()?.Shop_Now}
                      </span>
                      <span className="text-qyellow transition-all duration-300 ease-in-out group-hover:text-qblack">
                        <svg
                          width="6"
                          height="11"
                          viewBox="0 0 6 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-current transform rtl:rotate-180"
                        >
                          <rect
                            x="1.08984"
                            y="0.636719"
                            width="6.94219"
                            height="1.54271"
                            transform="rotate(45 1.08984 0.636719)"
                          />
                          <rect
                            x="6"
                            y="5.54492"
                            width="6.94219"
                            height="1.54271"
                            transform="rotate(135 6 5.54492)"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OneColumnAdsOne;
