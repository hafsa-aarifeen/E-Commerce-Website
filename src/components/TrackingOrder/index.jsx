import InputCom from "../Helpers/InputCom";
import PageTitle from "../Helpers/PageTitle";
import Thumbnail from "./Thumbnail";
import { useState } from "react";
import { toast } from "react-toastify";
import apiRequest from "../../../utils/apiRequest";
import { useRouter } from "next/router";
import isAuth from "../../../Middleware/isAuth";
import ServeLangItem from "../Helpers/ServeLangItem";

function TrackingOrder() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [date, setDate] = useState("");
  const trackOrder = () => {
    if (orderNumber) {
      apiRequest
        .orderTrack(orderNumber)
        .then((res) => {
          toast.error(res.data && res.data.message);
          
          if (res.data) {
            router.push(`order/${res.data.order.order_id}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("Someting Wrong");
    }
  };
  return (
    <div className="tracking-page-wrapper w-full">
      <div className="page-title mb-[40px]">
        <PageTitle
          title="Track Order"
          breadcrumb={[
            { name: ServeLangItem()?.home, path: "/" },
            { name: ServeLangItem()?.Track_Order, path: "/tracking-order" },
          ]}
        />
      </div>
      <div className="content-wrapper w-full mb-[40px]">
        <div className="container-x mx-auto">
          <h1 className="text-[22px] text-qblack font-semibold leading-9">
            {ServeLangItem()?.Track_Your_Order}
          </h1>
          <p className="text-[15px] text-qgraytwo leading-8 mb-5">
            {ServeLangItem()?.Enter_your_order_tracking_number_and_your_secret_id}.
          </p>
          <div className="w-full bg-white lg:px-[30px] px-5 py-[23px] lg:flex items-center">
            <div className="lg:w-[642px] w-full">
              <div className="mb-3">
                <InputCom
                  value={orderNumber}
                  inputHandler={(e) => setOrderNumber(e.target.value)}
                  placeholder="Order Number"
                  label="Order Tracking Number*"
                  inputClasses="w-full h-[50px]"
                />
              </div>
              <div className="mb-[30px]">
                <InputCom
                  value={date}
                  inputHandler={(e) => setDate(e.target.value)}
                  placeholder="23/09/2022"
                  label="Delivery Date"
                  inputClasses="w-full h-[50px]"
                />
              </div>

              <button onClick={trackOrder} type="button">
                <div className="w-[142px] h-[50px] black-btn flex justify-center items-center">
                  <span>{ServeLangItem()?.Track_Now}</span>
                </div>
              </button>
            </div>
            <div className="flex-1 flex justify-center mt-5 lg:mt-0">
              <Thumbnail />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default isAuth(TrackingOrder);
