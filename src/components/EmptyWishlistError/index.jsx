// import Empty from "./Empty";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import Image from "next/image";
import ServeLangItem from "../Helpers/ServeLangItem";
export default function EmptyWishlistError() {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [emptyWis, setEmptyWis] = useState(null);
  useEffect(() => {
    if (!emptyWis) {
      if (websiteSetup) {
        setEmptyWis(websiteSetup.payload?.image_content.empty_wishlist);
      }
    }
  }, [emptyWis, websiteSetup]);
  return (
    <div className="wishlist-card-wrapper w-full">
      <div className="flex justify-center items-center w-full">
        <div>
          <div className="sm:mb-10 mb-0 transform sm:scale-100 scale-50">
            {emptyWis && (
                <div className="w-[429px] h-[412px] relative">
                  <Image
                      layout="fill"
                      objectFit="scale-down"
                      src={process.env.NEXT_PUBLIC_BASE_URL + emptyWis}
                      alt="404"
                  />
                </div>
            )}
          </div>
          <div data-aos="fade-up" className="wishlist-content w-full">
            <h1 className="sm:text-xl text-base font-semibold text-center mb-5">
              {ServeLangItem()?.Empty_You_dont_Wishlist_any_Products}
            </h1>
            <Link href="/">
              <div className="flex justify-center w-full cursor-pointer">
                <div className="w-[180px] h-[50px] ">
                  <span type="button" className="yellow-btn">
                    {ServeLangItem()?.Back_to_Shop}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
