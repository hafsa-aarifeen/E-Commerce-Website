import Link from "next/link";
import React,{ useState } from "react";
import Compair from "../../Helpers/icons/Compair";
import ThinLove from "../../Helpers/icons/ThinLove";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import FontAwesomeCom from "../../Helpers/icons/FontAwesomeCom";
import ServeLangItem from "../../Helpers/ServeLangItem";

export default function Drawer({ className, open, action }) {
  const router = useRouter();
  const [tab, setTab] = useState("category");
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const categoryList = websiteSetup && websiteSetup.payload.productCategories;
  const customPages = websiteSetup && websiteSetup.payload.customPages;
  // const mageMenuList = websiteSetup && websiteSetup.payload.megaMenuCategories;
  // const megaMenuBanner = websiteSetup && websiteSetup.payload.megaMenuBanner;
  const [searchKey, setSearchkey] = useState("");
  const searchHandler = () => {
    if (searchKey !== "") {
      router.push({
        pathname: "/search",
        query: { search: searchKey },
      });
    } else {
      return false;
    }
  };
  return (
    <>
      <div
        className={`drawer-wrapper w-full block lg:hidden h-full relative  ${className || ""}`}
      >
        {open && (
          <div
            onClick={action}
            className="w-full h-screen bg-black bg-opacity-40 z-40 left-0 top-0 fixed"
          ></div>
        )}
        <div
          className={`w-[280px] transition-all duration-300 ease-in-out h-screen overflow-y-auto overflow-x-hidden overflow-style-none bg-white fixed top-0 z-50 ${
            open ? "left-0" : "-left-[280px]"
          }`}
        >
          <div className="w-full px-5 mt-5 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-5 items-center">
                <div className="compaire relative">
                  <Link href="/products-compaire">
                    <span>
                      <Compair />
                    </span>
                  </Link>
                  <span className="w-[18px] h-[18px] rounded-full bg-qyellow absolute -top-2.5 -right-2.5 flex justify-center items-center text-[9px]">
                    2
                  </span>
                </div>
                <div className="favorite relative">
                  <Link href="/wishlist">
                    <span>
                      <ThinLove />
                    </span>
                  </Link>
                  <span className="w-[18px] h-[18px] rounded-full bg-qyellow absolute -top-2.5 -right-2.5 flex justify-center items-center text-[9px]">
                    1
                  </span>
                </div>
              </div>
              <button onClick={action} type="button">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.0363 33.9994C7.66923 34.031 0.0436412 26.4423 0.000545718 17.0452C-0.0425497 7.68436 7.54917 0.0479251 16.9447 0.00021656C26.3072 -0.0467224 33.9505 7.54277 33.9998 16.9352C34.0483 26.3153 26.4411 33.9679 17.0363 33.9994Z"
                    fill="black"
                  />
                  <path
                    d="M17.0363 33.9994C26.4411 33.9679 34.0483 26.3153 33.9998 16.9352C33.9505 7.54277 26.3072 -0.0467224 16.9447 0.00021656C7.54917 0.0479251 -0.0425497 7.68436 0.000545718 17.0452C0.0436412 26.4423 7.66846 34.031 17.0363 33.9994ZM23.4629 21.5945C23.4514 21.8445 23.3321 22.0908 23.1305 22.3039C22.7865 22.6671 22.4479 23.0342 22.1039 23.3966C21.5236 24.0084 21.1458 24.0068 20.5648 23.3889C19.4581 22.2124 18.3492 21.0389 17.2533 19.8523C17.0633 19.6461 16.9686 19.6169 16.7608 19.8431C15.6511 21.0512 14.5222 22.2424 13.3978 23.4366C12.8753 23.9914 12.4697 23.9891 11.9388 23.4312C11.6032 23.0788 11.2715 22.7218 10.9399 22.3647C10.4089 21.7938 10.4081 21.3575 10.9376 20.7927C12.0503 19.6046 13.1593 18.4126 14.2836 17.2361C14.4822 17.0283 14.5037 16.9152 14.2921 16.6943C13.1654 15.5193 12.058 14.3266 10.9452 13.1385C10.4004 12.556 10.4042 12.1259 10.9545 11.5387C11.2785 11.1925 11.6009 10.8447 11.9272 10.5007C12.4821 9.91666 12.8822 9.92358 13.4417 10.5192C14.5468 11.6965 15.6588 12.8677 16.7516 14.0573C16.9671 14.2912 17.071 14.2651 17.271 14.0473C18.3831 12.8415 19.5082 11.6472 20.6363 10.4561C21.1273 9.93743 21.5521 9.94359 22.0469 10.4576C22.3848 10.8085 22.7157 11.1655 23.0474 11.5226C23.6115 12.1289 23.6122 12.5552 23.052 13.1539C21.9477 14.3328 20.8503 15.517 19.7321 16.6828C19.5058 16.9183 19.5382 17.0391 19.7475 17.2584C20.8641 18.4249 21.9623 19.6092 23.0681 20.7865C23.2721 21.002 23.456 21.229 23.4629 21.5945Z"
                    fill="#FE4949"
                  />
                  <path
                    d="M23.4614 21.5947C23.4545 21.2292 23.2706 21.0022 23.0659 20.7844C21.9608 19.6071 20.8619 18.4228 19.7452 17.2563C19.5359 17.0377 19.5036 16.9169 19.7298 16.6807C20.848 15.5157 21.9454 14.3307 23.0497 13.1518C23.61 12.5539 23.6084 12.1276 23.0451 11.5205C22.7134 11.1635 22.3825 10.8064 22.0447 10.4555C21.5498 9.9415 21.125 9.93611 20.6341 10.454C19.5059 11.6452 18.3808 12.8394 17.2688 14.0452C17.0679 14.263 16.964 14.2891 16.7493 14.0552C15.6565 12.8663 14.5445 11.6952 13.4394 10.5171C12.88 9.92149 12.4798 9.91456 11.9249 10.4986C11.5979 10.8426 11.2762 11.1904 10.9522 11.5367C10.402 12.1238 10.3981 12.5547 10.943 13.1364C12.0558 14.3245 13.1632 15.5172 14.2898 16.6922C14.5014 16.9131 14.4799 17.0254 14.2813 17.234C13.157 18.4113 12.0481 19.6025 10.9353 20.7906C10.4058 21.3561 10.4074 21.7917 10.9376 22.3626C11.2693 22.7197 11.601 23.076 11.9365 23.4291C12.4675 23.987 12.873 23.9893 13.3956 23.4345C14.5207 22.2403 15.6488 21.0491 16.7586 19.841C16.9671 19.614 17.061 19.644 17.2511 19.8502C18.3469 21.0368 19.4559 22.2103 20.5625 23.3868C21.1435 24.0047 21.5214 24.0063 22.1016 23.3945C22.4456 23.0321 22.7842 22.6643 23.1282 22.3018C23.3306 22.091 23.4507 21.8448 23.4614 21.5947Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full mt-5 px-5">
            <div className="search-bar w-full h-[34px]  flex ">
              <div className="flex-1 bg-white h-full border border-r-0 border-[#E9E9E9]">
                <input
                  value={searchKey}
                  onChange={(e) => setSearchkey(e.target.value)}
                  type="text"
                  className="w-full text-xs h-full focus:outline-none foucus:ring-0 placeholder:text-qgraytwo pl-2.5 "
                  placeholder="Search Product..."
                />
              </div>
              <div
                onClick={searchHandler}
                className="cursor-pointer w-[40px] h-full bg-qyellow flex justify-center items-center"
              >
                <span>
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 8.83158C0.0484783 8.43809 0.0969566 8.04461 0.169674 7.67571C0.484783 5.92962 1.2362 4.42946 2.39968 3.12604C3.75707 1.60128 5.45381 0.592971 7.44142 0.199486C9.76838 -0.267779 11.9741 0.0765214 14.0345 1.33076C16.3614 2.75714 17.84 4.82294 18.3975 7.50356C18.8823 9.7907 18.5187 11.9795 17.4037 14.0453C17.1856 14.4388 17.1856 14.4388 17.5007 14.7585C19.1247 16.4062 20.7487 18.0539 22.3727 19.7016C22.906 20.2427 23.1242 20.8575 22.9302 21.5953C22.5667 22.9971 20.8457 23.5135 19.7549 22.3822C18.8338 21.4231 17.9127 20.5132 16.9674 19.5541C16.216 18.7917 15.4888 18.0539 14.7374 17.2915C14.6889 17.2423 14.6404 17.1932 14.6162 17.1686C14.0345 17.4637 13.5012 17.808 12.9195 18.0539C10.4228 19.1114 7.90196 19.0868 5.42957 17.9555C3.56316 17.0948 2.15728 15.7422 1.16348 13.9469C0.533261 12.791 0.145435 11.5614 0.0484783 10.2334C0.0484783 10.1596 0.0242392 10.0858 0 10.012C0 9.64314 0 9.22507 0 8.83158ZM3.00566 9.4464C3.00566 12.9632 5.84164 15.816 9.30784 15.816C12.774 15.7914 15.5615 12.9632 15.5858 9.4464C15.5858 5.95422 12.7498 3.07685 9.30784 3.07685C5.8174 3.07685 3.00566 5.92962 3.00566 9.4464Z"
                      fill="#1D1D1D"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <div className="w-full mt-5 px-5 flex items-center space-x-3">
            <span
              onClick={() => setTab("category")}
              className={`text-base font-semibold  ${
                tab === "category" ? "text-qblack" : "text-qgray"
              }`}
            >
              {ServeLangItem()?.Categories}
            </span>
            <span className="w-[1px] h-[14px] bg-qgray"></span>
            <span
              onClick={() => setTab("menu")}
              className={`text-base font-semibold ${
                tab === "menu" ? "text-qblack" : "text-qgray "
              }`}
            >
              {ServeLangItem()?.Main_Menu}
            </span>
          </div>
          {tab === "category" ? (
            <div className="category-item mt-5 w-full">
              <ul className="categories-list">
                {categoryList &&
                  categoryList.map((item, i) => (
                    <li key={i} className="category-item">
                      <Link
                        href={{
                          pathname: "/products",
                          query: { category: item.slug },
                        }}
                      >
                        <div className=" flex justify-between items-center px-5 h-12 bg-white hover:bg-qyellow transition-all duration-300 ease-in-out cursor-pointer">
                          <div className="flex items-center space-x-6">
                            <span>
                              <span>
                                <FontAwesomeCom
                                  className="w-4 h-4"
                                  icon={item.icon}
                                />
                              </span>
                            </span>
                            <span className="text-sm font-400 capitalize">
                              {item.name}
                            </span>
                          </div>
                          <div>
                            <span>
                              <svg
                                width="6"
                                height="9"
                                viewBox="0 0 6 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="1.49805"
                                  y="0.818359"
                                  width="5.78538"
                                  height="1.28564"
                                  transform="rotate(45 1.49805 0.818359)"
                                  fill="#1D1D1D"
                                />
                                <rect
                                  x="5.58984"
                                  y="4.90918"
                                  width="5.78538"
                                  height="1.28564"
                                  transform="rotate(135 5.58984 4.90918)"
                                  fill="#1D1D1D"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <div className="menu-item mt-5 w-full">
              <ul className="categories-list">
                <li className="category-item">
                  <Link href="#">
                    <div className=" flex justify-between items-center px-5 h-12 bg-white hover:bg-qyellow transition-all duration-300 ease-in-out cursor-pointer">
                      <div className="flex items-center space-x-6">
                        <span className="text-sm font-400 capitalize">{ServeLangItem()?.Pages}</span>
                      </div>
                      <div>
                        <span>
                          <svg
                            width="6"
                            height="9"
                            viewBox="0 0 6 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="1.49805"
                              y="0.818359"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(45 1.49805 0.818359)"
                              fill="#1D1D1D"
                            />
                            <rect
                              x="5.58984"
                              y="4.90918"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(135 5.58984 4.90918)"
                              fill="#1D1D1D"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                  <ul className="submenu-list ml-5">
                    <li className="category-item">
                      <Link href="/privacy-policy">
                        <div className=" flex justify-between items-center px-5 h-12 bg-white hover:bg-qyellow transition-all duration-300 ease-in-out cursor-pointer">
                          <div className="flex items-center space-x-6">
                            <span className="text-sm font-400 capitalize">
                              {ServeLangItem()?.Privacy_Policy}
                            </span>
                          </div>
                          <div>
                            <span>
                              <svg
                                width="6"
                                height="9"
                                viewBox="0 0 6 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="1.49805"
                                  y="0.818359"
                                  width="5.78538"
                                  height="1.28564"
                                  transform="rotate(45 1.49805 0.818359)"
                                  fill="#1D1D1D"
                                />
                                <rect
                                  x="5.58984"
                                  y="4.90918"
                                  width="5.78538"
                                  height="1.28564"
                                  transform="rotate(135 5.58984 4.90918)"
                                  fill="#1D1D1D"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li className="category-item">
                      <Link href="/faq">
                        <div className=" flex justify-between items-center px-5 h-12 bg-white hover:bg-qyellow transition-all duration-300 ease-in-out cursor-pointer">
                          <div className="flex items-center space-x-6">
                            <span className="text-sm font-400 capitalize">{ServeLangItem()?.FAQ}</span>
                          </div>
                          <div>
                            <span>
                              <svg
                                width="6"
                                height="9"
                                viewBox="0 0 6 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="1.49805"
                                  y="0.818359"
                                  width="5.78538"
                                  height="1.28564"
                                  transform="rotate(45 1.49805 0.818359)"
                                  fill="#1D1D1D"
                                />
                                <rect
                                  x="5.58984"
                                  y="4.90918"
                                  width="5.78538"
                                  height="1.28564"
                                  transform="rotate(135 5.58984 4.90918)"
                                  fill="#1D1D1D"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li className="category-item">
                      <Link href="/terms-condition">
                        <div className=" flex justify-between items-center px-5 h-12 bg-white hover:bg-qyellow transition-all duration-300 ease-in-out cursor-pointer">
                          <div className="flex items-center space-x-6">
                            <span className="text-sm font-400 capitalize">
                              {ServeLangItem()?.Term_and_Conditions}
                            </span>
                          </div>
                          <div>
                            <span>
                              <svg
                                width="6"
                                height="9"
                                viewBox="0 0 6 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="1.49805"
                                  y="0.818359"
                                  width="5.78538"
                                  height="1.28564"
                                  transform="rotate(45 1.49805 0.818359)"
                                  fill="#1D1D1D"
                                />
                                <rect
                                  x="5.58984"
                                  y="4.90918"
                                  width="5.78538"
                                  height="1.28564"
                                  transform="rotate(135 5.58984 4.90918)"
                                  fill="#1D1D1D"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li className="category-item">
                      <Link href="/seller-terms-condition">
                        <div className=" flex justify-between items-center px-5 h-12 bg-white hover:bg-qgreen transition-all duration-300 ease-in-out cursor-pointer">
                          <div className="flex items-center space-x-6">
                            <span className="text-sm font-400 capitalize capitalize ">
                              {ServeLangItem()?.Seller_terms_and_conditions}
                            </span>
                          </div>
                          <div>
                            <span>
                              <svg
                                  width="6"
                                  height="9"
                                  viewBox="0 0 6 9"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                    x="1.49805"
                                    y="0.818359"
                                    width="5.78538"
                                    height="1.28564"
                                    transform="rotate(45 1.49805 0.818359)"
                                    fill="#1D1D1D"
                                />
                                <rect
                                    x="5.58984"
                                    y="4.90918"
                                    width="5.78538"
                                    height="1.28564"
                                    transform="rotate(135 5.58984 4.90918)"
                                    fill="#1D1D1D"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                    {customPages &&
                        customPages.length > 0 &&
                        customPages.map((item, i) => (
                            // eslint-disable-next-line react/jsx-key
                            <React.Fragment key={i}>
                              <li className="category-item">
                                <Link href={`/pages?custom=${item.slug}`} passHref>
                                  <div className=" flex justify-between items-center px-5 h-12 bg-white hover:bg-qyellow transition-all duration-300 ease-in-out cursor-pointer">
                                    <div className="flex items-center space-x-6">
                                  <span className="text-sm font-400 capitalize capitalize ">
                                    {item.page_name}
                                  </span>
                                    </div>
                                    <div>
                                  <span>
                                    <svg
                                        width="6"
                                        height="9"
                                        viewBox="0 0 6 9"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <rect
                                          x="1.49805"
                                          y="0.818359"
                                          width="5.78538"
                                          height="1.28564"
                                          transform="rotate(45 1.49805 0.818359)"
                                          fill="#1D1D1D"
                                      />
                                      <rect
                                          x="5.58984"
                                          y="4.90918"
                                          width="5.78538"
                                          height="1.28564"
                                          transform="rotate(135 5.58984 4.90918)"
                                          fill="#1D1D1D"
                                      />
                                    </svg>
                                  </span>
                                    </div>
                                  </div>
                                </Link>
                              </li>
                            </React.Fragment>
                        ))}
                  </ul>
                </li>

                <li className="category-item">
                  <Link href="/about">
                    <div className="flex justify-between items-center px-5 h-12 bg-white hover:bg-qyellow transition-all duration-300 ease-in-out cursor-pointer">
                      <div className="flex items-center space-x-6">
                        <span className="text-sm font-400 capitalize">{ServeLangItem()?.About}</span>
                      </div>
                      <div>
                        <span>
                          <svg
                            width="6"
                            height="9"
                            viewBox="0 0 6 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="1.49805"
                              y="0.818359"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(45 1.49805 0.818359)"
                              fill="#1D1D1D"
                            />
                            <rect
                              x="5.58984"
                              y="4.90918"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(135 5.58984 4.90918)"
                              fill="#1D1D1D"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
                <li className="category-item">
                  <Link href="/Blogs">
                    <div className="flex justify-between items-center px-5 h-12 bg-white hover:bg-qyellow transition-all duration-300 ease-in-out cursor-pointer">
                      <div className="flex items-center space-x-6">
                        <span className="text-sm font-400 capitalize">{ServeLangItem()?.blogs}</span>
                      </div>
                      <div>
                        <span>
                          <svg
                            width="6"
                            height="9"
                            viewBox="0 0 6 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="1.49805"
                              y="0.818359"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(45 1.49805 0.818359)"
                              fill="#1D1D1D"
                            />
                            <rect
                              x="5.58984"
                              y="4.90918"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(135 5.58984 4.90918)"
                              fill="#1D1D1D"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
                <li className="category-item">
                  <Link href="/contact">
                    <div className="flex justify-between items-center px-5 h-12 bg-white hover:bg-qyellow transition-all duration-300 ease-in-out cursor-pointer">
                      <div className="flex items-center space-x-6">
                        <span className="text-sm font-400 capitalize">Contact</span>
                      </div>
                      <div>
                        <span>
                          <svg
                            width="6"
                            height="9"
                            viewBox="0 0 6 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="1.49805"
                              y="0.818359"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(45 1.49805 0.818359)"
                              fill="#1D1D1D"
                            />
                            <rect
                              x="5.58984"
                              y="4.90918"
                              width="5.78538"
                              height="1.28564"
                              transform="rotate(135 5.58984 4.90918)"
                              fill="#1D1D1D"
                            />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
