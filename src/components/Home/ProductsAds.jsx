import Image from "next/image";
import Link from "next/link";
export default function ProductsAds({
  className,
  ads = ["", ""],
  sectionHeight,
  links = [],
}) {
  return (
    <div className={`w-full ${className || ""}`}>
      <div className="container-x mx-auto">
        <div
          className={`${sectionHeight} ${
            ads.length > 1 && ads.length <= 2
              ? "sm:flex xl:space-x-[30px] md:space-x-5"
              : ""
          } items-center w-full  overflow-hidden`}
        >
          <div
            data-aos="fade-right"
            className={`h-full relative ${
              ads.length > 1 && ads.length <= 2 ? "sm:w-1/2 w-full" : "w-full"
            }  `}
          >
            <Link href={links[0]} passHref>
              <a>
                <Image
                  layout="fill"
                  objectFit="scale-down"
                  src={`${ads[0]}`}
                  alt=""
                  className="w-full sm:h-full h-auto"
                />
              </a>
            </Link>
          </div>
          {ads.length > 1 && ads.length <= 2 && (
            <div data-aos="fade-left" className="relative flex-1 h-full">
              <Link href={links[1]} passHref>
                <a>
                  <Image
                    layout="fill"
                    objectFit="scale-down"
                    src={`${ads[1]}`}
                    alt=""
                    className="w-full h-full"
                  />
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
