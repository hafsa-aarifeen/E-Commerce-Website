import React, {useEffect, useState} from "react";
import ServeLangItem from "../../Helpers/ServeLangItem";
import InputCom from "../../Helpers/InputCom";
import apiRequest from "../../../../utils/apiRequest";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Link from "next/link";
import LoaderStyleOne from "../../Helpers/Loaders/LoaderStyleOne";
import settings from "../../../../utils/settings";
import Image from "next/image";
import countries from "../../../data/CountryCodes.json"

function SignupWidget({ redirect = true, signupActionPopup,changeContent }) {
  const router = useRouter();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+880");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checked, setCheck] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [getCountries, setGetCountries] = useState(null);
  const [countryDropToggle, setCountryDropToggle] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("BD");
  const selectCountryhandler=(value)=>{
    setSelectedCountry(value.code);
    setPhone(value.dial_code);
    setCountryDropToggle(false);
  };
  useEffect(() => {
   if(!getCountries){
     setGetCountries(countries && countries.countries);
   }
  }, [getCountries]);
  
  const rememberMe = () => {
    setCheck(!checked);
  };
  const doSignup = async () => {
    setLoading(true);
    await apiRequest
      .signup({
        name: fname + " " + lname,
        email: email,
        password: password,
        password_confirmation: confirmPassword,
        agree: checked ? 1 : "",
        phone:phone?phone:''
      })
      .then((res) => {
        setLoading(false);
        toast.success(res.data.notification);
        if (redirect) {
          router.push(`/verify-you?email=${email}`);
        }else{
          changeContent()
        }
        setFname("");
        setLname("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setCheck(false);
      })
      .catch((err) => {
        setLoading(false);
        setErrors(err.response && err.response.data.errors);
      });
  };
  const {phone_number_required,default_phone_code}=settings();
  useEffect(()=>{
    if(default_phone_code){
      let defaultCountry=getCountries && getCountries.length>0 && getCountries.find((item)=>item.code===default_phone_code);
       if(defaultCountry){
         setPhone(defaultCountry.dial_code);
         setSelectedCountry(defaultCountry.code);
       }
    }
  }, [default_phone_code, getCountries])
  return (
    <div className="w-full">
      <div className="title-area flex flex-col justify-center items-center relative text-center mb-7">
        <h1 className="text-[34px] font-bold leading-[74px] text-qblack">
          {ServeLangItem()?.Create_Account}
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
        <div className="flex sm:flex-row flex-col space-y-5 sm:space-y-0 sm:space-x-5 rtl:space-x-reverse mb-5">
          <div className="h-full">
            <InputCom
              placeholder={ServeLangItem()?.Name}
              label={ServeLangItem()?.First_Name + "*"}
              name="fname"
              type="text"
              inputClasses="h-[50px]"
              value={fname}
              inputHandler={(e) => setFname(e.target.value)}
            />
            {errors && Object.hasOwn(errors, "name") ? (
              <span className="text-sm mt-1 text-qred">{errors.name[0]}</span>
            ) : (
              ""
            )}
          </div>
          <div className="h-full">
            <InputCom
              placeholder={ServeLangItem()?.Name}
              label={ServeLangItem()?.Last_Name + "*"}
              name="lname"
              type="text"
              inputClasses="h-[50px]"
              value={lname}
              inputHandler={(e) => setLname(e.target.value)}
            />
            {errors && Object.hasOwn(errors, "name") ? (
              <span className="text-sm mt-1 text-qred">{errors.name[0]}</span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="input-item mb-5">
          <InputCom
            placeholder={ServeLangItem()?.Email}
            label={ServeLangItem()?.Email_Address + "*"}
            name="email"
            type="email"
            inputClasses="h-[50px]"
            value={email}
            error={!!(errors && Object.hasOwn(errors, "email"))}
            inputHandler={(e) => setEmail(e.target.value)}
          />
          {errors && Object.hasOwn(errors, "email") ? (
            <span className="text-sm mt-1 text-qred">{errors.email[0]}</span>
          ) : (
            ""
          )}
        </div>
        {phone_number_required==='1'&&(
            <div className="input-item mb-5 relative">
              <InputCom
                  placeholder={ServeLangItem()?.Phone_Number}
                  label={ServeLangItem()?.phone + "*"}
                  name="phone"
                  type="text"
                  inputClasses="h-[50px] placeholder:capitalize pl-20"
                  value={phone}
                  error={!!(errors && Object.hasOwn(errors, "phone"))}
                  inputHandler={(e) => setPhone(e.target.value)}
              />
              {errors && Object.hasOwn(errors, "phone") ? (
                  <span className="text-sm mt-1 text-qred">{errors.phone[0]}</span>
              ) : (
                  ""
              )}
              <button onClick={()=>setCountryDropToggle(!countryDropToggle)} type="button" className="w-[70px] h-[50px] bg-qgray-border absolute left-0 top-[29px] flex justify-center items-center">
                <div className="flex items-center">
                  <span>
                    <Image width="30" height="20" src={`/assets/images/countries/${selectedCountry}.svg`} alt="country"/>
                  </span>
                  <span className="text-qgray">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 14l-4-4h8z"/></svg>
                  </span>
                </div>
              </button>
              <div style={{boxShadow: "rgb(0 0 0 / 14%) 0px 15px 50px 0px",display:countryDropToggle?'block':'none'}} className="country-dropdown-list w-[250px] h-[250px] bg-white absolute left-0 top-[80px] z-20 overflow-y-scroll">
                <ul>
                  {getCountries && getCountries.length>0&&getCountries.map((item,i)=>(
                      <li onClick={()=>selectCountryhandler(item)} key={i} className="flex space-x-1.5 items-center px-3 py-1 cursor-pointer">
                        <span className="w-[25px]">
                           <Image width="25" height="15" src={`/assets/images/countries/${item.code}.svg`} alt="country"/>
                        </span>
                            <span className="text-sm text-qgray capitalize flex-1">
                          {item.name}
                        </span>
                      </li>
                  ))}
                </ul>
              </div>
            </div>
        )}
        <div className="flex sm:flex-row flex-col space-y-5 sm:space-y-0 sm:space-x-5 rtl:space-x-reverse mb-5">
          <div className="h-full">
            <InputCom
              placeholder="* * * * * *"
              label={ServeLangItem()?.Password + "*"}
              name="password"
              type="password"
              inputClasses="h-[50px]"
              value={password}
              inputHandler={(e) => setPassword(e.target.value)}
            />
            {errors && Object.hasOwn(errors, "password") ? (
              <span className="text-sm mt-1 text-qred">
                {errors.password[0]}
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="h-full">
            <InputCom
              placeholder="* * * * * *"
              label={ServeLangItem()?.Confirm_Password + "*"}
              name="confirm_password"
              type="password"
              inputClasses="h-[50px]"
              value={confirmPassword}
              inputHandler={(e) => setConfirmPassword(e.target.value)}
            />
            {errors && Object.hasOwn(errors, "password") ? (
              <span className="text-sm mt-1 text-qred">
                {errors.password[0]}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="forgot-password-area mb-7">
          <div className="remember-checkbox flex items-center space-x-2.5 rtl:space-x-reverse">
            <button
              onClick={rememberMe}
              type="button"
              className="w-5 h-5 text-qblack flex justify-center items-center border border-light-gray"
            >
              {checked && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            {redirect ? (
              <Link href="/seller-terms-condition">
                <span className="text-base text-black cursor-pointer">
                  {ServeLangItem()?.I_agree_all_terms_and_condition_in_ecoShop}
                </span>
              </Link>
            ) : (
              <button type="button">
                <span className="text-base text-black cursor-pointer">
                  {ServeLangItem()?.I_agree_all_terms_and_condition_in_ecoShop}
                </span>
              </button>
            )}
          </div>
        </div>
        <div className="signin-area mb-3">
          <div className="flex justify-center">
            <button
              onClick={doSignup}
              type="button"
              disabled={!checked}
              className="black-btn disabled:bg-opacity-50 disabled:cursor-not-allowed  w-full h-[50px] font-semibold flex justify-center bg-purple items-center"
            >
              <span className="text-sm text-white block">
                {ServeLangItem()?.Create_Account}
              </span>
              {loading && (
                <span className="w-5 " style={{ transform: "scale(0.3)" }}>
                  <LoaderStyleOne />
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="signup-area flex justify-center">
          <p className="text-base text-qgraytwo font-normal">
            {ServeLangItem()?.Already_have_an_Account}?
            {redirect ? (
              <Link href="/login">
                <span className="ml-2 text-qblack cursor-pointer ml-1">
                  {ServeLangItem()?.Log_In}
                </span>
              </Link>
            ) : (
              <button onClick={signupActionPopup} type="button">
                <span className="ml-2 text-qblack cursor-pointer ml-1">
                  {ServeLangItem()?.Log_In}
                </span>
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupWidget;
