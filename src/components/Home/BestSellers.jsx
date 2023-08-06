import Image from "next/image";
import Link from "next/link";
export default function BestSellers({ className, sallers = [] }) {
  return (
    <div className={`w-full ${className || ""}`}>
      <div className="grid xl:grid-cols-6 lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 xl:gap-[30px] sm:gap-5 gap-2">
        {sallers.map((saller) => (
          <div
            key={saller.id}
            data-aos="fade-left"
            data-aos-duration="500"
            className="item w-full flex flex-col items-center"
          >
              <Link
                  href={{
                      pathname: "/seller-products",
                      query: { seller: saller.slug },
                  }}
              >
                  <a rel="noopener noreferrer">
                      <div className="sm:w-[170px] sm:h-[170px] w-[140px] h-[140px] rounded-full bg-white flex justify-center items-center overflow-hidden mb-2 relative">
                          <Image
                              layout="fill"
                              objectFit="scale-down"
                              src={`${process.env.NEXT_PUBLIC_BASE_URL + saller.logo}`}
                              alt={saller.slug}
                          />
                      </div>
                      <p className="text-base font-500 text-center cursor-pointer">
                          {saller.shop_name}
                      </p>
                  </a>
              </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
