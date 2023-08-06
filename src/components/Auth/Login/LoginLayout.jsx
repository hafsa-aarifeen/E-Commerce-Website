import React from "react";
import Layout from "../../Partials/Layout";
import Image from "next/image";

function LoginLayout({ imgThumb, children }) {
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="login-page-wrapper w-full py-10">
        <div className="container-x mx-auto">
          <div className="lg:flex items-center relative">
            <div className="lg:w-[572px] w-full h-[783px] bg-white flex flex-col justify-center sm:p-10 p-5 border border-[#E0E0E0]">
              {/*login Widget*/}
              {children && children}
            </div>
            <div className="flex-1 lg:flex hidden transform scale-60 xl:scale-100   xl:justify-center ">
              <div
                className="absolute ltr:xl:-right-20 ltr:-right-[138px] rtl::xl:-left-20 rtl:-left-[138px]"
                style={{ top: "calc(50% - 258px)" }}
              >
                {imgThumb && (
                  <Image
                    width={608}
                    height={480}
                    src={`${process.env.NEXT_PUBLIC_BASE_URL + imgThumb}`}
                    alt="login"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default LoginLayout;
