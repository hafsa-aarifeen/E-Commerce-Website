import React, { useState } from "react";
import ServeLangItem from "../../Helpers/ServeLangItem";
import InputCom from "../../Helpers/InputCom";
import { toast } from "react-toastify";
import apiRequest from "../../../../utils/apiRequest";
import { useRouter } from "next/router";
import LoaderStyleOne from "../../Helpers/Loaders/LoaderStyleOne";

function VerifyWidget({ redirect = true, verifyActionPopup }) {
  const router = useRouter();
  const location = useRouter();
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const doVerify = async () => {
    setLoading(true);
    await apiRequest
      .verification(
        {
          email: location.query.email,
        },
        otp
      )
      .then((res) => {
        setLoading(false);
        if (res) {
          toast.success(res.data.notification);
          if (redirect) {
            router.push("/login");
          } else {
            verifyActionPopup();
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response) {
          if (err.response.data.notification) {
            toast.error(err.response.data.notification);
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
  };
  return (
    <div className="w-full">
      <div className="title-area flex flex-col justify-center items-center relative text-center mb-7">
        <h1 className="text-[34px] font-bold leading-[74px] text-qblack">
          {ServeLangItem()?.Verify_You}
        </h1>
        <div className="shape -mt-6">
          <svg
            width="354"
            height="30"
            viewBox="0 0 354 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 28.8027C17.6508 20.3626 63.9476 8.17089 113.509 17.8802C166.729 28.3062 341.329 42.704 353 1"
              stroke="#FFBB38"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      <div className="input-area">
        <div className="input-item mb-5">
          <InputCom
            placeholder="* * * * * *"
            label={ServeLangItem()?.OTP}
            name="otp"
            type="text"
            inputClasses="h-[50px]"
            value={otp}
            error={errors}
            inputHandler={(e) => setOtp(e.target.value.trim())}
          />
          {/* {errors && Object.hasOwn(errors, "email") ? (
                        <span className="text-sm mt-1 text-qred">
                          {errors.email[0]}
                        </span>
                      ) : (
                        ""
                      )} */}
        </div>

        <div className="signin-area mb-3">
          <div className="flex justify-center">
            <button
              disabled={!otp}
              onClick={doVerify}
              type="button"
              className="black-btn disabled:bg-opacity-50 disabled:cursor-not-allowed  w-full h-[50px] font-semibold flex justify-center bg-purple items-center"
            >
              <span className="text-sm text-white block">
                {ServeLangItem()?.Verify}
              </span>
              {loading && (
                <span className="w-5 " style={{ transform: "scale(0.3)" }}>
                  <LoaderStyleOne />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyWidget;
