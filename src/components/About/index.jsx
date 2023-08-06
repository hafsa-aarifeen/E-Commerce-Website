import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import BlogCard from "../Helpers/Cards/BlogCard";
import DataIteration from "../Helpers/DataIteration";
import FontAwesomeCom from "../Helpers/icons/FontAwesomeCom";
import Star from "../Helpers/icons/Star";
import PageTitle from "../Helpers/PageTitle";
import SimpleSlider from "../Helpers/SliderCom";
import Layout from "../Partials/Layout";
import ServeLangItem from "../Helpers/ServeLangItem";
import settings from "../../../utils/settings";
export default function About({ aboutData }) {
  const settingTestimonial = {
    slidesToShow:
      aboutData.testimonials.length < 3 ? aboutData.testimonials.length : 3,
    slidesToScroll: 1,
    autoplay: false,
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    dots: false,
    responsive: [
      {
        breakpoint: 1026,
        settings: {
          slidesToShow:
            aboutData.testimonials.length < 2
              ? aboutData.testimonials.length
              : 2,
          slidesToScroll: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        },
      },
    ],
  };

  const slider = useRef(null);
  const prev = () => {
    slider.current.slickPrev();
  };
  const next = () => {
    slider.current.slickNext();
  };
  const { text_direction } = settings();
  useEffect(() => {
    const getSliderInitElement = document.querySelectorAll(
      ".feedback-slider-wrapper div > .item"
    );
    getSliderInitElement.forEach((item) =>
      item.setAttribute("dir", `${text_direction}`)
    );
  }, [text_direction]);
  const rs = aboutData.blogs.slice(0, 2).map((item) => {
    return {
      id: item.id,
      by: item.blog.admin_id,
      comments_length: item.blog.active_comments.length,
      title: item.blog.title,
      article: item.blog.description,
      picture: process.env.NEXT_PUBLIC_BASE_URL + item.blog.image,
      slug: item.blog.slug,
    };
  });
  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="about-page-wrapper w-full">
        <div className="title-area w-full">
          <PageTitle
            title={ServeLangItem()?.About_us}
            breadcrumb={[
              { name: ServeLangItem()?.home, path: "/" },
              { name: ServeLangItem()?.About_us, path: "/about" },
            ]}
          />
        </div>

        <div className="aboutus-wrapper w-full py-10">
          <div className="container-x mx-auto">
            <div className="w-full min-h-[665px] lg:flex lg:space-x-12 rtl:space-x-reverse items-center pb-10 lg:pb-0">
              <div className="md:w-[570px] w-full md:h-[560px] h-auto rounded overflow-hidden my-5 lg:my-0 relative">
                <Image
                  layout="fill"
                  src={`${
                    process.env.NEXT_PUBLIC_BASE_URL +
                    aboutData.aboutUs.banner_image
                  }`}
                  alt="about"
                  className="w-full h-full"
                />
              </div>
              <div className="content flex-1">
                <div className="about-content">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: aboutData.aboutUs.description,
                    }}
                  ></div>
                </div>

                <Link href="/contact" passHref>
                  <a rel="noopener noreferrer">
                    <div className="w-[121px] h-10 mt-5 cursor-pointer">
                      <span className="yellow-btn">
                        {ServeLangItem()?.Contact_Us}
                      </span>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="customer-feedback w-full bg-white py-[60px]">
          <div className="title flex justify-center mb-5">
            <h1 className="text-[30px] font-semibold text-qblack">
              {ServeLangItem()?.Customers_Feedback}
            </h1>
          </div>
          <div className="feedback-slider-wrapper w-vw relative overflow-hidden">
            <SimpleSlider selector={slider} settings={settingTestimonial}>
              {aboutData.testimonials.length > 0 &&
                aboutData.testimonials.map((item, i) => (
                  <div
                    key={i}
                    className="item h-auto bg-primarygray sm:px-10 sm:py-9 p-2"
                  >
                    <div className="">
                      <div className="rating flex space-x-1 rtl:space-x-reverse items-center mb-4">
                        {Array.from(Array(parseInt(item.rating)), () => (
                          <span key={Math.random()}>
                            <Star w="20" h="20" />
                          </span>
                        ))}
                        {parseInt(item.rating) < 5 && (
                          <>
                            {Array.from(
                              Array(5 - parseInt(item.rating)),
                              () => (
                                <span
                                  key={parseInt(item.rating) + Math.random()}
                                  className="text-gray-500"
                                >
                                  <Star defaultValue={false} w="20" h="20" />
                                </span>
                              )
                            )}
                          </>
                        )}
                        <div>
                          <span className="text-[13px] text-qblack">
                            ({parseInt(item.rating)})
                          </span>
                        </div>
                      </div>
                      <div className="text-[15px] text-qgraytwo leading-[30px]  line-clamp-6 mb-4">
                        {item.comment}
                      </div>
                      <div className="flex items-center space-x-2.5 rtl:space-x-reverse mt-3">
                        <div className="w-[50px] h-[50px] rounded-full overflow-hidden relative">
                          <Image
                            layout="fill"
                            src={`${
                              process.env.NEXT_PUBLIC_BASE_URL + item.image
                            }`}
                            alt="user"
                          />
                        </div>
                        <div>
                          <p className="text-[18px] text-qblack font-medium">
                            {item.name}
                          </p>
                          <p className="text-qgraytwo text-[13px]">
                            {item.designation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </SimpleSlider>

            <div className="slider-btns flex justify-center mt-[40px]">
              <div className="flex space-x-5 rtl:space-x-reverse item-center">
                <button
                  onClick={prev}
                  type="button"
                  className="w-[48px] h-[48px] rounded-full overflow-hidden flex justify-center items-center border border-qyellow text-qyellow focus:bg-qyellow focus:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={next}
                  type="button"
                  className="w-[48px] h-[48px] rounded-full overflow-hidden flex justify-center items-center border border-qyellow text-qyellow focus:bg-qyellow focus:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 transform rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container-x mx-auto my-[60px]">
          <div
            data-aos="fade-down"
            className="best-services w-full bg-qyellow flex flex-col space-y-10 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center lg:h-[110px] px-10 lg:py-0 py-10"
          >
            {aboutData &&
              aboutData.services.map((item) => (
                <div key={item.id} className="item">
                  <div className="flex space-x-5 rtl:space-x-reverse items-center">
                    <div>
                      <div>
                        <FontAwesomeCom className="w-8 h-8" icon={item.icon} />
                      </div>
                    </div>
                    <div>
                      <p className="text-black text-[15px] font-700 tracking-wide mb-1 uppercase">
                        {item.title}
                      </p>
                      <p className="text-sm text-qblack line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="blog-post-wrapper w-full mb-[30px]">
          <div className="container-x mx-auto">
            <div className="blog-post-title flex justify-center items-cente mb-[30px]">
              <h1 className="text-3xl font-semibold text-qblack">
                {ServeLangItem()?.My_Latest_News}
              </h1>
            </div>

            <div className="blogs-wrapper w-full">
              <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-[30px] gap-5">
                <DataIteration datas={rs} startLength={0} endLength={2}>
                  {({ datas }) => (
                    <div
                      data-aos="fade-up"
                      key={datas.id}
                      className="item w-full"
                    >
                      <BlogCard datas={datas} />
                    </div>
                  )}
                </DataIteration>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
