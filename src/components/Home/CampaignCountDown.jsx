import Image from "next/image";
import Link from "next/link";
import CountDown from "../Helpers/CountDown";
import ShopNowBtn from "../Helpers/Buttons/ShopNowBtn";
import GooglePlay from "../Helpers/icons/GooglePlay";
import AppleStore from "../Helpers/icons/AppleStore";
import ServeLangItem from "../Helpers/ServeLangItem";

export default function CampaignCountDown({
  className,
  lastDate,
  downloadData,
  flashSaleData,
}) {
  const { showDate, showHour, showMinute, showSecound } = CountDown(lastDate);
  return (
    <div>
      <div className={`w-full lg:h-[460px] ${className || ""}`}>
        <div className="container-x mx-auto h-full">
          <div className="lg:flex xl:space-x-[30px] lg:space-x-5 rtl:space-x-reverse items-center h-full">
            <div
              data-aos="fade-right"
              className="campaign-countdown lg:w-1/2 group h-[300px] sm:h-[400px] lg:h-full w-full mb-5 lg:mb-0 "
              style={{
                background: `url(${
                  process.env.NEXT_PUBLIC_BASE_URL +
                    flashSaleData.homepage_image ||
                  "/assets/images/campaign-cover-countdown.jpg"
                }) no-repeat`,
                backgroundSize: "cover",
              }}
            >
              <div className="w-full xl:p-12 p-5">
                <div className="countdown-wrapper w-full flex lg:justify-between justify-evenly lg:mb-10 mb-2">
                  <div className="countdown-item">
                    <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center">
                      <span className="font-700 sm:text-[30px] text-[14px] text-[#EB5757]">
                        {showDate}
                      </span>
                    </div>
                    <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8">
                      {ServeLangItem()?.Days}
                    </p>
                  </div>
                  <div className="countdown-item">
                    <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center">
                      <span className="font-700 sm:text-[30px] text-[14px] text-[#2F80ED]">
                        {showHour}
                      </span>
                    </div>
                    <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8">
                      {ServeLangItem()?.Hours}
                    </p>
                  </div>
                  <div className="countdown-item">
                    <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center">
                      <span className="font-700 sm:text-[30px] text-[14px] text-[#219653]">
                        {showMinute}
                      </span>
                    </div>
                    <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8">
                      {ServeLangItem()?.Minutes}
                    </p>
                  </div>
                  <div className="countdown-item">
                    <div className="countdown-number sm:w-[100px] sm:h-[100px] w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center">
                      <span className="font-700 sm:text-[30px] text-[14px] text-[#EF5DA8]">
                        {showSecound}
                      </span>
                    </div>
                    <p className="sm:text-[18px] text-[12px] font-500 text-center leading-8">
                      {ServeLangItem()?.Seconds}
                    </p>
                  </div>
                </div>
                <div className="countdown-title mb-4">
                  <h1 className="text-[44px] text-qblack font-600">
                    {flashSaleData.title}
                  </h1>
                </div>
                <div className="w-[90px]">
                  <Link href="/flash-sale" passHref>
                    <a rel="noopener noreferrer">
                      <ShopNowBtn />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div
              data-aos="fade-left"
              className="download-app flex-1 lg:h-full h-[430px] xl:p-12 p-5"
              style={{
                backgroundImage: `url(${
                  downloadData.image
                    ? process.env.NEXT_PUBLIC_BASE_URL + downloadData.image
                    : "/assets/images/download-app-cover.png"
                })`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="get-app">
                  <p className="text-[13px] font-600 text-qblack mb-3">
                    {ServeLangItem()?.MOBILE_APP_VERSION}
                  </p>
                  <h1 className="lg:text-[30px] text-2xl font-600 text-qblack leading-10 mb-8">
                    {ServeLangItem()?.Get_Our}
                    <span className="text-qred border-b-2 border-qred mx-2">
                      {ServeLangItem()?.Mobile_App}
                    </span>
                    <br /> {ServeLangItem()?.Its_Make_easy_for_you_life}
                  </h1>
                  <div className="flex space-x-5 rtl:space-x-reverse items-center">
                    <div className="bg-white w-[170px] h-[60px] flex justify-center items-center cursor-pointer">
                      <Link
                        href={
                          downloadData.play_store
                            ? downloadData.play_store
                            : "#"
                        }
                        passHref
                      >
                        <a rel="noopener noreferrer">
                          <GooglePlay />
                        </a>
                      </Link>
                    </div>
                    <div className="bg-white w-[170px] h-[60px] flex justify-center items-center cursor-pointer">
                      <Link
                        href={
                          downloadData.app_store ? downloadData.app_store : "#"
                        }
                        passHref
                      >
                        <a rel="noopener noreferrer">
                          <AppleStore />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
                {/*<div className="app-screen w-full h-full relative">*/}
                {/*  <Image*/}
                {/*    layout="fill"*/}
                {/*    objectFit="contain"*/}
                {/*    src={appscreen || `/assets/images/app-screen.png`}*/}
                {/*    alt=""*/}
                {/*  />*/}
                {/*</div>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
