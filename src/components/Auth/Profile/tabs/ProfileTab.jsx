import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import auth from "../../../../../utils/auth";
import InputCom from "../../../Helpers/InputCom";
import Selectbox from "../../../Helpers/Selectbox";
// import apiRequest from "../../../../../utils/apiRequest";
import { toast } from "react-toastify";
import ServeLangItem from "../../../Helpers/ServeLangItem";
import countries from "../../../../data/CountryCodes.json"
import settings from "../../../../../utils/settings";
export default function ProfileTab({ profileInfo, updatedProfile }) {
  const [name, setName] = useState(profileInfo.personInfo.name);
  const [email, setEmail] = useState(profileInfo.personInfo.email);
  const [phone, setPhone] = useState(null);
  const [countryDropdown, setCountryDropdown] = useState(null);
  const [country, setCountry] = useState(null);
  useEffect(()=>{
    if(profileInfo){
      if(profileInfo.personInfo.country_id&& profileInfo.personInfo.country_id!==''){
        setCountry(parseInt(profileInfo.personInfo.country_id));
      }else{
        setCountry(null);
      }
    }
  },[profileInfo])
  const [stateDropdown, setStateDropdown] = useState(null);
  const [state, setState] = useState(null);
  useEffect(()=>{
    if(profileInfo){
      if(profileInfo.personInfo.state_id&& profileInfo.personInfo.state_id!==''){
        setState(parseInt(profileInfo.personInfo.state_id));
      }else{
        setState(null);
      }
    }
  },[profileInfo])
  const [cityDropdown, setCityDropdown] = useState(null);
  const [city, setcity] = useState(null);
  useEffect(()=>{
    if(profileInfo){
      if(profileInfo.personInfo.city_id&& profileInfo.personInfo.city_id!==''){
        setcity(parseInt(profileInfo.personInfo.city_id));
      }else{
        setcity(null);
      }
    }
  },[profileInfo])
  const [address, setAddress] = useState(profileInfo.personInfo.address);
  const [errors, setErrors] = useState(null);
  const [formImg, setFormImag] = useState(null);
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
      setGetCountries(countries&&countries.countries);
    }
  }, [getCountries]);
  const getState = (value) => {
    if (auth() && value) {
      setCountry(value.id);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/state-by-country/${
            value.id
          }?token=${auth().access_token}`
        )
        .then((res) => {
          setCityDropdown(null);
          setStateDropdown(res.data && res.data.states);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return false;
    }
  };
  const getcity = (value) => {
    if (auth() && value) {
      setState(value.id);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/user/city-by-state/${
            value.id
          }?token=${auth().access_token}`
        )
        .then((res) => {
          setCityDropdown(res.data && res.data.cities);
        })
        .catch((err) => {
          console.log(err.response);
        });
    } else {
      return false;
    }
  };
  const selectCity = (value) => {
    if (auth() && value) {
      setcity(value.id);
    }
  };
  useEffect(() => {
    if (auth()) {
      if(profileInfo&& profileInfo.countries&&profileInfo.countries.length>0){
        setCountryDropdown(profileInfo.countries)
      }else{
        axios
            .get(
                `${process.env.NEXT_PUBLIC_BASE_URL}api/user/address/create?token=${
                    auth().access_token
                }`
            )
            .then((res) => {
              if (res.data) {
                setCountryDropdown(res.data.countries);
              }
            })
            .catch((err) => {
              console.log(err);
            });
      }
    }
  }, [profileInfo]);
  const [profileImg, setprofileImg] = useState(null);
  const [getImg] = useState(
    profileInfo && profileInfo.personInfo && profileInfo.personInfo.image
      ? profileInfo.personInfo.image
      : profileInfo.defaultProfile.image
  );
  const profileImgInput = useRef(null);
  const browseprofileImg = () => {
    profileImgInput.current.click();
  };
  const profileImgChangHandler = (e) => {
    if (e.target.value !== "") {
      const imgReader = new FileReader();
      imgReader.onload = (event) => {
        setprofileImg(event.target.result); //store
      };
      imgReader.readAsDataURL(e.target.files[0]); //view
      setFormImag(e.target.files[0]);
    }
  };
  const updateProfile = async () => {
    if (auth()) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("country", country);
      formData.append("address", address);
      formData.append("image", formImg);
      formData.append("state", state);
      formData.append("city", city);
      await axios({
        method: "post",
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL
        }api/user/update-profile?token=${auth().access_token}`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          updatedProfile();
          toast.success(res.data && res.data.notification);
        })
        .catch((err) => {
          setErrors(err.response && err.response.data.errors);
        });
    } else {
      return false;
    }
  };
  const {default_phone_code}=settings();
  useEffect(()=>{
    if(default_phone_code){
      let defaultCountry=getCountries && getCountries.length>0 && getCountries.find((item)=>item.code===default_phone_code);
      if(defaultCountry){
       setPhone(()=>{
         if(profileInfo&& profileInfo.personInfo.phone && profileInfo.personInfo.phone !== "null"){
           return profileInfo.personInfo.phone
         }else{
           return defaultCountry.dial_code
         }
       })
        setSelectedCountry(defaultCountry.code);
      }
    }
  }, [default_phone_code, getCountries])
  return (
    <>
      {profileInfo && (
        <>
          <div className="flex lg:flex-row flex-col-reverse space-x-8 rtl:space-x-reverse">
            <div className="lg:w-[570px] w-full ">
              <div className="input-item mb-8">
                <InputCom
                  label={ServeLangItem()?.Name}
                  placeholder="Name"
                  type="text"
                  inputClasses="h-[50px]"
                  value={name}
                  error={!!(errors && Object.hasOwn(errors, "name"))}
                  inputHandler={(e) => setName(e.target.value)}
                />
                {errors && Object.hasOwn(errors, "name") ? (
                  <span className="text-sm mt-1 text-qred">
                    {errors.name[0]}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="input-item md:flex md:space-x-2.5 rtl:space-x-reverse mb-8">
                <div className="md:w-1/2 w-full h-full mb-8 md:mb-0">
                  <div>
                    <p className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
                      {ServeLangItem()?.Email}
                      <span className="text-yellow-500 text-xs ml-1">
                        ({ServeLangItem()?.Read_Only})
                      </span>
                    </p>
                    <div className="w-full border border-yellow-500 px-6  h-[50px] bg-yellow-50 text-dark-gray flex items-center cursor-not-allowed rounded">
                      {email}
                    </div>
                  </div>
                  {/*<InputCom*/}
                  {/*  label="Email*"*/}
                  {/*  placeholder="demoemial@gmail.com"*/}
                  {/*  type="email"*/}
                  {/*  inputClasses="h-[50px]"*/}
                  {/*  value={email}*/}
                  {/*  inputHandler={(e) => setEmail(e.target.value)}*/}
                  {/*  error={!!(errors && Object.hasOwn(errors, "email"))}*/}
                  {/*/>*/}
                  {/*{errors && Object.hasOwn(errors, "email") ? (*/}
                  {/*  <span className="text-sm mt-1 text-qred">*/}
                  {/*    {errors.email[0]}*/}
                  {/*  </span>*/}
                  {/*) : (*/}
                  {/*  ""*/}
                  {/*)}*/}
                </div>
                <div className="md:w-1/2 w-full h-full relative">
                  <InputCom
                    label={ServeLangItem()?.Phone_Number}
                    placeholder={ServeLangItem()?.Phone_Number}
                    type="text"
                    inputClasses="h-[50px] placeholder:capitalize pl-20"
                    value={phone ? phone : ""}
                    inputHandler={(e) => setPhone(e.target.value)}
                    error={!!(errors && Object.hasOwn(errors, "phone"))}
                  />
                  {errors && Object.hasOwn(errors, "phone") ? (
                    <span className="text-sm mt-1 text-qred">
                      {errors.phone[0]}
                    </span>
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
              </div>

              <div className="mb-6">
                <h1 className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
                  {ServeLangItem()?.Country}*
                </h1>
                <div
                  className={`w-full h-[50px] border border-qgray-border px-5 flex justify-between items-center mb-2 ${
                    !!(errors && Object.hasOwn(errors, "country"))
                      ? "border-qred"
                      : "border-qgray-border"
                  }`}
                >
                  <Selectbox
                    action={getState}
                    className="w-full"
                    defaultValue={
                      countryDropdown &&
                      countryDropdown.length > 0 &&
                      (function () {
                        let item =
                          countryDropdown.length > 0 &&
                          countryDropdown.find(
                            (item) =>
                              parseInt(item.id) ===
                              parseInt(profileInfo.personInfo.country_id)
                          );
                        return item ? item.name : "Select";
                      })()
                    }
                    datas={countryDropdown && countryDropdown}
                  >
                    {({ item }) => (
                      <>
                        <div className="flex justify-between items-center w-full">
                          <div>
                            <span className="text-[13px] text-qblack">
                              {item}
                            </span>
                          </div>
                          <span>
                            <svg
                              width="11"
                              height="7"
                              viewBox="0 0 11 7"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.4 6.8L0 1.4L1.4 0L5.4 4L9.4 0L10.8 1.4L5.4 6.8Z"
                                fill="#222222"
                              />
                            </svg>
                          </span>
                        </div>
                      </>
                    )}
                  </Selectbox>
                </div>
                {errors && Object.hasOwn(errors, "country") ? (
                  <span className="text-sm mt-1 text-qred">
                    {errors.country[0]}
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="md:flex md:space-x-5 rtl:space-x-reverse items-center mb-6">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <h1 className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
                    {ServeLangItem()?.State}*
                  </h1>
                  <div
                    className={`w-full h-[50px] border border-qgray-border px-5 flex justify-between items-center mb-2 ${
                      !!(errors && Object.hasOwn(errors, "state"))
                        ? "border-qred"
                        : "border-qgray-border"
                    }`}
                  >
                    <Selectbox
                      action={getcity}
                      className="w-full"
                      defaultValue={
                        profileInfo.states &&
                        profileInfo.states.length > 0 &&
                        (function () {
                          let item = profileInfo.states.find(
                            (item) =>
                              item.id ===
                              parseInt(profileInfo.personInfo.state_id)
                          );
                          return item ? item.name : "Select";
                        })()
                      }
                      datas={stateDropdown && stateDropdown}
                    >
                      {({ item }) => (
                        <>
                          <div className="flex justify-between items-center w-full">
                            <div>
                              <span className="text-[13px] text-qblack">
                                {item}
                              </span>
                            </div>
                            <span>
                              <svg
                                width="11"
                                height="7"
                                viewBox="0 0 11 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5.4 6.8L0 1.4L1.4 0L5.4 4L9.4 0L10.8 1.4L5.4 6.8Z"
                                  fill="#222222"
                                />
                              </svg>
                            </span>
                          </div>
                        </>
                      )}
                    </Selectbox>
                  </div>
                  {errors && Object.hasOwn(errors, "state") ? (
                    <span className="text-sm mt-1 text-qred">
                      {errors.state[0]}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="md:w-1/2 w-full">
                  <h1 className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
                    {ServeLangItem()?.City}*
                  </h1>
                  <div
                    className={`w-full h-[50px] border border-qgray-border px-5 flex justify-between items-center mb-2 ${
                      !!(errors && Object.hasOwn(errors, "city"))
                        ? "border-qred"
                        : "border-qgray-border"
                    }`}
                  >
                    <Selectbox
                      action={selectCity}
                      className="w-full"
                      defaultValue={
                        profileInfo.cities &&
                        profileInfo.cities.length > 0 &&
                        (function () {
                          let item = profileInfo.cities.find(
                            (item) =>
                              item.id ===
                              parseInt(profileInfo.personInfo.city_id)
                          );
                          return item ? item.name : "Select";
                        })()
                      }
                      datas={cityDropdown && cityDropdown}
                    >
                      {({ item }) => (
                        <>
                          <div className="flex justify-between items-center w-full">
                            <div>
                              <span className="text-[13px] text-qblack">
                                {item}
                              </span>
                            </div>
                            <span>
                              <svg
                                width="11"
                                height="7"
                                viewBox="0 0 11 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5.4 6.8L0 1.4L1.4 0L5.4 4L9.4 0L10.8 1.4L5.4 6.8Z"
                                  fill="#222222"
                                />
                              </svg>
                            </span>
                          </div>
                        </>
                      )}
                    </Selectbox>
                  </div>
                  {errors && Object.hasOwn(errors, "city") ? (
                    <span className="text-sm mt-1 text-qred">
                      {errors.city[0]}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <div className="input-item mb-8">
                <InputCom
                  label={ServeLangItem()?.Address}
                  placeholder={ServeLangItem()?.Your_address_Here}
                  type="text"
                  inputClasses="h-[50px]"
                  value={address}
                  inputHandler={(e) => setAddress(e.target.value)}
                  error={!!(errors && Object.hasOwn(errors, "address"))}
                />
                {errors && Object.hasOwn(errors, "address") ? (
                  <span className="text-sm mt-1 text-qred">
                    {errors.address[0]}
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="update-logo w-full mb-9">
                <h1 className="text-xl tracking-wide font-bold text-qblack flex items-center mb-2">
                  {ServeLangItem()?.Update_Profile}
                  <span className="ml-1">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 0C4.47457 0 0 4.47791 0 10C0 15.5221 4.47791 20 10 20C15.5221 20 20 15.5221 20 10C19.9967 4.48126 15.5221 0.00669344 10 0ZM10 16.67C9.53815 16.67 9.16667 16.2985 9.16667 15.8367C9.16667 15.3748 9.53815 15.0033 10 15.0033C10.4618 15.0033 10.8333 15.3748 10.8333 15.8367C10.8333 16.2952 10.4618 16.67 10 16.67ZM11.6098 10.425C11.1078 10.7396 10.8132 11.2952 10.8333 11.8842V12.5033C10.8333 12.9652 10.4618 13.3367 10 13.3367C9.53815 13.3367 9.16667 12.9652 9.16667 12.5033V11.8842C9.14324 10.6861 9.76907 9.56827 10.8032 8.96586C11.4357 8.61781 11.7704 7.90161 11.6366 7.19545C11.5027 6.52276 10.9772 5.99732 10.3046 5.8668C9.40094 5.69946 8.5308 6.29853 8.36346 7.20214C8.34673 7.30254 8.33668 7.40295 8.33668 7.50335C8.33668 7.96519 7.9652 8.33668 7.50335 8.33668C7.0415 8.33668 6.67002 7.96519 6.67002 7.50335C6.67002 5.66265 8.16265 4.17001 10.0067 4.17001C11.8474 4.17001 13.34 5.66265 13.34 7.50669C13.3333 8.71821 12.674 9.83601 11.6098 10.425Z"
                        fill="#374557"
                        fillOpacity="0.6"
                      />
                    </svg>
                  </span>
                </h1>
                <p className="text-sm text-qgraytwo mb-5 ">
                  {ServeLangItem()?.Profile_of_at_least_Size}
                  <span className="ml-1 text-qblack">300x300</span>
                </p>
                <div className="flex xl:justify-center justify-start">
                  <div className="relative">
                    <div className="sm:w-[198px] sm:h-[198px] w-[199px] h-[199px] rounded-full overflow-hidden relative">
                      <Image
                        layout="fill"
                        src={
                          profileImg
                            ? `${profileImg}`
                            : `${process.env.NEXT_PUBLIC_BASE_URL + getImg}`
                        }
                        alt=""
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <input
                      ref={profileImgInput}
                      onChange={(e) => profileImgChangHandler(e)}
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                    <div
                      onClick={browseprofileImg}
                      className="w-[32px] h-[32px] absolute bottom-7 right-0  bg-qyellow rounded-full cursor-pointer"
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.5147 11.5C17.7284 12.7137 18.9234 13.9087 20.1296 15.115C19.9798 15.2611 19.8187 15.4109 19.6651 15.5683C17.4699 17.7635 15.271 19.9587 13.0758 22.1539C12.9334 22.2962 12.7948 22.4386 12.6524 22.5735C12.6187 22.6034 12.5663 22.6296 12.5213 22.6296C11.3788 22.6334 10.2362 22.6297 9.09365 22.6334C9.01498 22.6334 9 22.6034 9 22.536C9 21.4009 9 20.2621 9.00375 19.1271C9.00375 19.0746 9.02997 19.0109 9.06368 18.9772C10.4123 17.6249 11.7609 16.2763 13.1095 14.9277C14.2295 13.8076 15.3459 12.6913 16.466 11.5712C16.4884 11.5487 16.4997 11.5187 16.5147 11.5Z"
                          fill="white"
                        />
                        <path
                          d="M20.9499 14.2904C19.7436 13.0842 18.5449 11.8854 17.3499 10.6904C17.5634 10.4694 17.7844 10.2446 18.0054 10.0199C18.2639 9.76139 18.5261 9.50291 18.7884 9.24443C19.118 8.91852 19.5713 8.91852 19.8972 9.24443C20.7251 10.0611 21.5492 10.8815 22.3771 11.6981C22.6993 12.0165 22.7105 12.4698 22.3996 12.792C21.9238 13.2865 21.4443 13.7772 20.9686 14.2717C20.9648 14.2792 20.9536 14.2867 20.9499 14.2904Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="action-area flex space-x-4 rtl:space-x-reverse items-center">
            <button type="button" className="text-sm text-qred font-semibold">
              {ServeLangItem()?.Cancel}
            </button>
            <button
              onClick={updateProfile}
              type="button"
              className="w-[164px] h-[50px] bg-qyellow rounded text-qblack text-sm"
            >
              {ServeLangItem()?.Update_Profile}
            </button>
          </div>
        </>
      )}
    </>
  );
}
