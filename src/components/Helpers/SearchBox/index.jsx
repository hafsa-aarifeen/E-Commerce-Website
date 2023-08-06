// import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import axios from "axios";
import { useRouter } from "next/router";
import ServeLangItem from "../ServeLangItem";

export default function SearchBox({ className }) {
  const router = useRouter();
  const [toggleCat, setToggleCat] = useState(false);
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [categories, setCategories] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [searchKey, setSearchkey] = useState("");
  useEffect(()=>{
    if(router && router.route && router.route==='/search'){
      setSearchkey(router.query?router.query.search:'');
    }
    return ()=>{
      setSearchkey("");
    }
  },[router])
  const categoryHandler = (value) => {
    setSelectedCat(value);
    setToggleCat(!toggleCat);
  };
  useEffect(() => {
    if (websiteSetup) {
      setCategories(
        websiteSetup.payload && websiteSetup.payload.productCategories
      );
    }
  }, [websiteSetup]);
  const searchHandler = () => {
    if (searchKey !== "") {
      if (selectedCat) {
        router.push({
          pathname: "/search",
          query: { search: searchKey, category: selectedCat.slug },
        });
      } else {
        router.push({
          pathname: "/search",
          query: { search: searchKey },
        });
      }
    } else if (searchKey === "" && selectedCat) {
      router.push({
        pathname: "/products",
        query: { category: selectedCat.slug },
      });
    } else {
      return false;
    }
  };

  return (
    <>
      <div
        className={`w-full h-full flex items-center  border border-qgray-border bg-white  ${
          className || ""
        }`}
      >
        <div className="flex-1 bg-red-500 h-full">
          <div className="h-full">
            <input
              value={searchKey}
              onKeyDown={(e) => e.key === "Enter" && searchHandler()}
              onChange={(e) => setSearchkey(e.target.value)}
              type="text"
              className="search-input"
              placeholder={ServeLangItem()?.Search_products+"..."}
            />
          </div>
        </div>
        <div className="w-[1px] h-[22px] bg-qgray-border"></div>
        <div className="flex-1 flex items-center px-4 relative">
          <button
            onClick={() => setToggleCat(!toggleCat)}
            type="button"
            className="w-full text-xs font-500 text-qgray flex justify-between items-center"
          >
            <span className="line-clamp-1">
              {selectedCat ? selectedCat.name : ServeLangItem()?.All_Categories}
            </span>
            <span>
              <svg
                width="10"
                height="5"
                viewBox="0 0 10 5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="9.18359"
                  y="0.90918"
                  width="5.78538"
                  height="1.28564"
                  transform="rotate(135 9.18359 0.90918)"
                  fill="#8E8E8E"
                />
                <rect
                  x="5.08984"
                  y="5"
                  width="5.78538"
                  height="1.28564"
                  transform="rotate(-135 5.08984 5)"
                  fill="#8E8E8E"
                />
              </svg>
            </span>
          </button>
          {toggleCat && (
            <>
              <div
                className="w-full h-full fixed left-0 top-0 z-50"
                onClick={() => setToggleCat(!toggleCat)}
              ></div>
              <div
                className="w-[227px] h-auto absolute bg-white left-0 top-[29px] z-50 p-5"
                style={{ boxShadow: "0px 15px 50px 0px rgba(0, 0, 0, 0.14)" }}
              >
                <ul className="flex flex-col space-y-2">
                  {categories &&
                    categories.map((item, i) => (
                      <li onClick={() => categoryHandler(item)} key={i}>
                        <span className="text-qgray text-sm font-400 border-b border-transparent hover:border-qyellow hover:text-qyellow cursor-pointer">
                          {item.name}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </>
          )}
        </div>
        <button
          onClick={searchHandler}
          className="search-btn w-[93px]  h-full text-sm font-600 "
          type="button"
        >
          {ServeLangItem()?.Search}
        </button>
      </div>
    </>
  );
}
