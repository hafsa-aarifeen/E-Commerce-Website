import Image from "next/image";
import Link from "next/link";
import DataIteration from "../Helpers/DataIteration";
export default function BrandSection({ className, sectionTitle, brands = [] }) {
  return (
    <div data-aos="fade-up" className={`w-full ${className || ""}`}>
      <div className="container-x mx-auto">
        <div className=" section-title flex justify-between items-center mb-5">
          <div>
            <h1 className="sm:text-3xl text-xl font-600 text-qblacktext">
              {sectionTitle}
            </h1>
          </div>
        </div>
        <div className="grid lg:grid-cols-6 sm:grid-cols-4 grid-cols-2">
          <DataIteration
            datas={brands}
            startLength={0}
            endLength={brands.length}
          >
            {({ datas }) => (
              <div key={datas.id} className="item">
                <Link
                  href={{
                    pathname: "/products",
                    query: { brand: datas.slug },
                  }}
                >
                  <div className="w-full h-[130px] bg-white border border-primarygray flex justify-center items-center relative cursor-pointer">
                    <Image
                      layout="fill"
                      objectFit="scale-down"
                      src={`${process.env.NEXT_PUBLIC_BASE_URL + datas.logo}`}
                      alt={datas.name}
                    />
                  </div>
                </Link>
              </div>
            )}
          </DataIteration>
        </div>
      </div>
    </div>
  );
}
