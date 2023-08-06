import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BreadcrumbCom from "../../BreadcrumbCom";
import IcoAdress from "./icons/IcoAdress";
import IcoCart from "./icons/IcoCart";
import IcoDashboard from "./icons/IcoDashboard";
import IcoLogout from "./icons/IcoLogout";
import IcoLove from "./icons/IcoLove";
import IcoPassword from "./icons/IcoPassword";
import IcoPeople from "./icons/IcoPeople";
import IcoReviewHand from "./icons/IcoReviewHand";
import AddressesTab from "./tabs/AddressesTab";
import Dashboard from "./tabs/Dashboard";
import OrderTab from "./tabs/OrderTab";
import PasswordTab from "./tabs/PasswordTab";
import { useDispatch } from "react-redux";
import isAuth from "../../../../Middleware/isAuth";
import apiRequest from "../../../../utils/apiRequest";
import auth from "../../../../utils/auth";
import { fetchWishlist } from "../../../store/wishlistData";
import Multivendor from "../../Shared/Multivendor";
import ProfileTab from "./tabs/ProfileTab";
import ReviewTab from "./tabs/ReviewTab";
import WishlistTab from "./tabs/WishlistTab";
import ServeLangItem from "../../Helpers/ServeLangItem";

function Profile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [switchDashboard, setSwitchDashboard] = useState(false);
  const location = useRouter();
  const getHashContent = location.asPath.split("#");
  const [active, setActive] = useState("dashboard");
  const [dashBoardData, setDashboardData] = useState(null);
  const [profileInfo, setProfile] = useState(null);
  const [orders, setOrders] = useState(null);
  const [review, setReview] = useState(null);
  useEffect(() => {
    setActive(
      getHashContent && getHashContent.length > 1
        ? getHashContent[1]
        : "dashboard"
    );
  }, [getHashContent]);
  useEffect(() => {
    if (!dashBoardData) {
      if (auth()) {
        apiRequest
          .dashboard(auth().access_token)
          .then((res) => {
            setDashboardData(res.data && res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return false;
      }
    }
  }, [dashBoardData]);
  useEffect(() => {
    if (!orders) {
      if (auth()) {
        apiRequest
          .orders(auth().access_token)
          .then((res) => {
            setOrders(res.data && res.data.orders.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [orders]);
  useEffect(() => {
    if (!review) {
      if (auth()) {
        apiRequest
          .getReview(auth().access_token)
          .then((res) => {
            setReview(res && res.data.reviews && res.data.reviews.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [review]);

  const updateProfile = () => {
    if (auth()) {
      apiRequest
        .profileInfo(auth().access_token)
        .then((res) => {
          setProfile(res.data && res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return false;
    }
  };
  useEffect(() => {
    if (!profileInfo) {
      updateProfile();
    }
  }, [profileInfo]);
  const logout = () => {
    if (auth) {
      apiRequest.logout(auth.access_token);
      localStorage.removeItem("auth");
      dispatch(fetchWishlist());
      location.push("/login");
    }
  };
  const switchDashboardHandler = () => {
    setSwitchDashboard(!switchDashboard);
  };
  useEffect(() => {
    if (switchDashboard) {
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
      const dashboardUrl = baseURL + "seller/dashboard";
      router.push(dashboardUrl);
    }
  }, [switchDashboard]);
  const checkSellerAndVendor =
    Multivendor() === 1 && dashBoardData && dashBoardData.is_seller;
  return (
    <div className="profile-page-wrapper w-full">
      <div className="container-x mx-auto">
        <div className="w-full my-10">
          <BreadcrumbCom
            paths={[
              { name: ServeLangItem()?.home, path: "/" },
              { name: ServeLangItem()?.profile, path: "/profile" },
            ]}
          />
          <div className="w-full bg-white xl:p-10 p-5">
            <div className="title-area w-full flex justify-between items-center">
              <h1 className="text-[22px] font-bold text-qblack">
                {ServeLangItem()?.Your_Dashboard}
              </h1>
              {checkSellerAndVendor && (
                <div className="switch-dashboard flex md:flex-row md:space-x-3 flex-col space-y-3 md:space-y-0 rtl:space-x-reverse rtl:space-x-reverse items-center">
                  <p className="text-qgray text-base">
                    {ServeLangItem()?.Switch_Dashboard}
                  </p>
                  <button
                    onClick={switchDashboardHandler}
                    type="button"
                    className="w-[73px] h-[31px] border border-[#D9D9D9] rounded-full relative "
                  >
                    <div
                      className={`w-[23px] h-[23px] bg-qblack rounded-full absolute top-[3px] transition-all duration-300 ease-in-out ${
                        switchDashboard ? "left-[44px]" : "left-[4px]"
                      }`}
                    ></div>
                  </button>
                </div>
              )}
            </div>
            <div className="profile-wrapper w-full mt-8 xl:flex xl:space-x-10 rtl:space-x-reverse">
              <div className="xl:w-[236px] w-full xl:min-h-[600px] ltr:xl:border-r rtl:xl:border-l border-[rgba(0, 0, 0, 0.1)] mb-10 xl:mb-0">
                <div className="flex xl:flex-col flex-row xl:space-y-10 rtl:space-x-reverse flex-wrap gap-3 xl:gap-0">
                  <div className="item group">
                    <Link href="/profile#dashboard">
                      <div className="flex space-x-3 rtl:space-x-reverse items-center text-qgray hover:text-qblack capitalize">
                        <span>
                          <IcoDashboard />
                        </span>
                        <span className=" font-normal text-base capitalize cursor-pointer">
                          {ServeLangItem()?.Dashboard}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="item group">
                    <Link href="/profile#profile">
                      <div className="flex space-x-3 rtl:space-x-reverse items-center text-qgray hover:text-qblack capitalize">
                        <span>
                          <IcoPeople />
                        </span>
                        <span className=" font-normal text-base capitalize cursor-pointer">
                          {ServeLangItem()?.Personal_Info}
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/*<div className="item group">*/}
                  {/*  <Link href="/profile#payment">*/}
                  {/*    <div className="flex space-x-3 rtl:space-x-reverse items-center text-qgray hover:text-qblack capitalize">*/}
                  {/*      <span>*/}
                  {/*        <IcoPayment />*/}
                  {/*      </span>*/}
                  {/*      <span className=" font-normal text-base capitalize cursor-pointer">*/}
                  {/*        Payment Method*/}
                  {/*      </span>*/}
                  {/*    </div>*/}
                  {/*  </Link>*/}
                  {/*</div>*/}
                  <div className="item group">
                    <Link href="/profile#order">
                      <div className="flex space-x-3 rtl:space-x-reverse items-center text-qgray hover:text-qblack capitalize">
                        <span>
                          <IcoCart />
                        </span>
                        <span className=" font-normal text-base capitalize cursor-pointer">
                          {ServeLangItem()?.Order}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="item group">
                    <Link href="/profile#wishlist">
                      <div className="flex space-x-3 rtl:space-x-reverse items-center text-qgray hover:text-qblack capitalize">
                        <span>
                          <IcoLove />
                        </span>
                        <span className=" font-normal text-base capitalize cursor-pointer">
                          {ServeLangItem()?.Wishlist}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="item group">
                    <Link href="/profile#address">
                      <div className="flex space-x-3 rtl:space-x-reverse items-center text-qgray hover:text-qblack capitalize">
                        <span>
                          <IcoAdress />
                        </span>
                        <span className=" font-normal text-base capitalize cursor-pointer">
                          {ServeLangItem()?.Address}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="item group">
                    <Link href="/profile#review">
                      <div className="flex space-x-3 rtl:space-x-reverse items-center text-qgray hover:text-qblack capitalize">
                        <span>
                          <IcoReviewHand />
                        </span>
                        <span className=" font-normal text-base capitalize cursor-pointer">
                          {ServeLangItem()?.Reviews}
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="item group">
                    <Link href="/profile#password">
                      <div className="flex space-x-3 rtl:space-x-reverse items-center text-qgray hover:text-qblack capitalize">
                        <span>
                          <IcoPassword />
                        </span>
                        <span className=" font-normal text-base capitalize cursor-pointer">
                          {ServeLangItem()?.Change_Password}
                        </span>
                      </div>
                    </Link>
                  </div>
                  {/*<div className="item group">*/}
                  {/*  <Link href="/profile#support">*/}
                  {/*    <div className="flex space-x-3 rtl:space-x-reverse items-center text-qgray hover:text-qblack capitalize">*/}
                  {/*      <span>*/}
                  {/*        <IcoSupport />*/}
                  {/*      </span>*/}
                  {/*      <span className=" font-normal text-base capitalize cursor-pointer">*/}
                  {/*        Support Ticket*/}
                  {/*      </span>*/}
                  {/*    </div>*/}
                  {/*  </Link>*/}
                  {/*</div>*/}
                  <div className="item group">
                    <div
                      onClick={logout}
                      className="flex space-x-3 rtl:space-x-reverse items-center text-qgray hover:text-qblack capitalize"
                    >
                      <span>
                        <IcoLogout />
                      </span>
                      <span className=" font-normal text-base capitalize cursor-pointer">
                        {ServeLangItem()?.Logout}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="item-body dashboard-wrapper w-full">
                  {active === "dashboard" ? (
                    <>
                      {dashBoardData && (
                        <Dashboard dashBoardData={dashBoardData} />
                      )}
                    </>
                  ) : active === "profile" ? (
                    <>
                      {profileInfo && (
                        <ProfileTab
                          profileInfo={profileInfo}
                          updatedProfile={updateProfile}
                        />
                      )}
                    </>
                  ) : active === "order" ? (
                    <OrderTab orders={orders} />
                  ) : active === "wishlist" ? (
                    <WishlistTab />
                  ) : active === "address" ? (
                    <AddressesTab />
                  ) : active === "password" ? (
                    <PasswordTab />
                  ) : active === "review" ? (
                    <ReviewTab reviews={review} />
                  ) : (
                    ""
                  )}
                  {/*: active === "support" ? (*/}
                  {/*<SupportTab />*/}
                  {/*)*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default isAuth(Profile);
