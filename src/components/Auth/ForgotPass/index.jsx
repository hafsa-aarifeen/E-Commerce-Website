import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiRequest from "../../../../utils/apiRequest";
import InputCom from "../../Helpers/InputCom";
import LoaderStyleOne from "../../Helpers/Loaders/LoaderStyleOne";
import Layout from "../../Partials/Layout";
import { useSelector } from "react-redux";
import Image from "next/dist/client/image";
import ServeLangItem from "../../Helpers/ServeLangItem";

export default function ForgotPass() {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPass, setResetpass] = useState(false);
  const [otp, setOtp] = useState("");
  const [forgotUser, setForgotUser] = useState(true);
  const [newPass, setNewPass] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState(null);
  const [imgThumb, setImgThumb] = useState(null);
  useEffect(() => {
    if (websiteSetup) {
      setImgThumb(websiteSetup.payload.image_content.login_image);
    }
  }, [websiteSetup]);
  const doForgot = async () => {
    setLoading(true);
    await apiRequest
      .forgotPass({
        email: email,
      })
      .then((res) => {
        setResetpass(true);
        setForgotUser(false);
        setLoading(false);
        setErrors(null);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setErrors(err.response);
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
  const doReset = async () => {
    setLoading(true);
    await apiRequest
      .resetPass(
        {
          email: email,
          password: newPass,
          password_confirmation: confirmPassword,
        },
        otp
      )
      .then((res) => {
        setLoading(false);
        router.push("login");
        toast.success(res.data.notification);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setErrors(err.response);
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
    <Layout childrenClasses="pt-0 pb-0">
      <div className="login-page-wrapper w-full py-10">
        <div className="container-x mx-auto">
          <div className="lg:flex items-center relative">
            <div className="lg:w-[572px] w-full h-[783px] bg-white flex flex-col justify-center sm:p-10 p-5 border border-[#E0E0E0]">
              {forgotUser ? (
                <div className="w-full">
                  <div className="title-area flex flex-col justify-center items-center relative text-center mb-7">
                    <h1 className="text-[34px] font-bold leading-[74px] text-qblack capitalize">
                      {ServeLangItem()?.Forgot_password}
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
                        placeholder={ServeLangItem()?.Email_Address}
                        label={ServeLangItem()?.Email_Address + "*"}
                        name="email"
                        type="email"
                        inputClasses="h-[50px]"
                        inputHandler={(e) => setEmail(e.target.value.trim())}
                        value={email}
                      />
                    </div>

                    <div className="signin-area mb-3.5">
                      <div className="flex justify-center">
                        <button
                          onClick={doForgot}
                          type="button"
                          disabled={email ? false : true}
                          className="black-btn disabled:bg-opacity-50 disabled:cursor-not-allowed  mb-6 text-sm text-white w-full h-[50px] font-semibold flex justify-center bg-purple items-center"
                        >
                          <span>{ServeLangItem()?.Send}</span>
                          {loading && (
                            <span
                              className="w-5 "
                              style={{ transform: "scale(0.3)" }}
                            >
                              <LoaderStyleOne />
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : resetPass ? (
                <div className="w-full">
                  <div className="title-area flex flex-col justify-center items-center relative text-center mb-7">
                    <h1 className="text-[34px] font-bold leading-[74px] text-qblack">
                      {ServeLangItem()?.Reset_Password}
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
                      {/* {errors && Object.hasOwn(errors.data.errors, "email") ? (
                        <span className="text-sm mt-1 text-qred">
                          {errors.data.errors.email[0]}
                        </span>
                      ) : (
                        ""
                      )} */}
                    </div>
                    <div className="input-item mb-5">
                      <InputCom
                        placeholder="* * * * * *"
                        label={ServeLangItem()?.New_Password}
                        name="new_password"
                        type="password"
                        inputClasses="h-[50px]"
                        value={newPass}
                        error={
                          errors &&
                          errors.data.errors &&
                          Object.hasOwn(errors.data.errors, "password")
                            ? true
                            : false
                        }
                        inputHandler={(e) => setNewPass(e.target.value.trim())}
                      />
                      {errors &&
                      errors.data.errors &&
                      Object.hasOwn(errors.data.errors, "password") ? (
                        <span className="text-sm mt-1 text-qred">
                          {errors.data.errors.password[0]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="input-item mb-5">
                      <InputCom
                        placeholder="* * * * * *"
                        label={ServeLangItem()?.Confirm_Password + "*"}
                        name="Confirm Password"
                        type="password"
                        inputClasses="h-[50px]"
                        value={confirmPassword}
                        error={
                          errors &&
                          errors.data.errors &&
                          Object.hasOwn(errors.data.errors, "password")
                            ? true
                            : false
                        }
                        inputHandler={(e) =>
                          setConfirmPassword(e.target.value.trim())
                        }
                      />
                      {errors &&
                      errors.data.errors &&
                      Object.hasOwn(errors.data.errors, "password") ? (
                        <span className="text-sm mt-1 text-qred">
                          {errors.data.errors.password[0]}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="signin-area mb-3.5">
                      <div className="flex justify-center">
                        <button
                          onClick={doReset}
                          type="button"
                          disabled={
                            otp && confirmPassword && newPass ? false : true
                          }
                          className="black-btn disabled:bg-opacity-50 disabled:cursor-not-allowed  mb-6 text-sm text-white w-full h-[50px] font-semibold flex justify-center bg-purple items-center"
                        >
                          <span>{ServeLangItem()?.Reset}</span>
                          {loading && (
                            <span
                              className="w-5 "
                              style={{ transform: "scale(0.3)" }}
                            >
                              <LoaderStyleOne />
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="flex-1 lg:flex hidden transform scale-60 xl:scale-100   xl:justify-center ">
              <div
                className="absolute ltr:xl:-right-20 ltr:-right-[138px] rtl:-left-20 rtl:-left-[138px]"
                style={{ top: "calc(50% - 258px)" }}
              >
                {imgThumb && (
                  <Image
                    width={608}
                    height={480}
                    src={`${process.env.NEXT_PUBLIC_BASE_URL + imgThumb}`}
                    alt="login"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
