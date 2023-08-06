import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiRequest from "../../../../../utils/apiRequest";
import auth from "../../../../../utils/auth";
import InputCom from "../../../Helpers/InputCom";
import LoaderStyleOne from "../../../Helpers/Loaders/LoaderStyleOne";
import Selectbox from "../../../Helpers/Selectbox";
import ServeLangItem from "../../../Helpers/ServeLangItem";

export default function AddressesTab() {
  const [newAddress, setNewAddress] = useState(false);
  const [addresses, setAddresses] = useState(null);
  const [fName, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [home, setHome] = useState(true);
  const [office, setOffice] = useState(false);
  const [countryDropdown, setCountryDropdown] = useState(null);
  const [country, setCountry] = useState(null);
  const [stateDropdown, setStateDropdown] = useState(null);
  const [state, setState] = useState(null);
  const [cityDropdown, setCityDropdown] = useState(null);
  const [city, setcity] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const getAllAddress = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/address?token=${
          auth().access_token
        }`
      )
      .then((res) => {
        res.data && setAddresses(res.data.addresses);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (auth()) {
      getAllAddress();
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
  }, []);
  const getState = async (value) => {
    if (auth() && value) {
      setCountry(value.id);
      await axios
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
  const getcity = async (value) => {
    if (auth() && value) {
      setState(value.id);
      await axios
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
  const saveAddress = async () => {
    setLoading(true);
    if (auth()) {
      apiRequest
        .saveAddress(auth().access_token, {
          name: fName,
          email: email,
          phone: phone,
          address: address,
          type: home ? "home" : office ? "office" : null,
          country: country,
          state: state,
          city: city,
        })
        .then((res) => {
          setLoading(false);
          setFname("");
          setEmail("");
          setPhone("");
          setAddress("");
          setCountryDropdown(null);
          setStateDropdown(null);
          setCityDropdown(null);
          setErrors(null);
          getAllAddress();
          setNewAddress(false);
          toast.success(res.data && res.data.notification, {
            autoClose: 1000,
          });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          err.response && setErrors(err.response.data.errors);
        });
    } else {
      return false;
    }
  };
  const deleteAddress = (id) => {
    if (auth()) {
      apiRequest
        .deleteAddress(id, auth().access_token)
        .then((res) => {
          toast.success(res.data && res.data.notification);
          getAllAddress();
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response && err.response.data.notification);
        });
    }
  };
  const [editAdd, setEdit] = useState(null);
  const editAddress = (id) => {
    setEdit(id);
    if (auth()) {
      apiRequest
        .editAddress(id, auth().access_token)
        .then(async (res) => {
          if (res.data) {
            if (res.data.address) {
              setFname(res.data.address.name);
              setEmail(res.data.address.email);
              setPhone(res.data.address.phone);
              setAddress(res.data.address.address);
              setHome(res.data.address.type === "1");
              setOffice(res.data.address.type === "0");
              setCountry(parseInt(res.data.address.country_id));
              setState(parseInt(res.data.address.state_id));
              setcity(parseInt(res.data.address.city_id));
              await getState(res.data.address.country);
              await getcity(res.data.address.country_state);
              setNewAddress(!newAddress);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const updateAddress = async (id) => {
    setLoading(true);
    if (auth()) {
      apiRequest
        .updateAddress(id, auth().access_token, {
          name: fName,
          email: email,
          phone: phone,
          address: address,
          type: home ? "home" : office ? "office" : null,
          country: country,
          state: state,
          city: city,
        })
        .then((res) => {
          editAddress(id);
          getAllAddress();
          toast.success(res.data && res.data.notification, {
            autoClose: 1000,
          });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          err.response && setErrors(err.response.data.errors);
        });
    } else {
      return false;
    }
  };
  const addNewAddressHandler = () => {
    setFname("");
    setEmail("");
    setPhone("");
    setAddress("");
    setHome(true);
    setOffice(false);
    setCountry(null);
    setState(null);
    setcity(null);
    setNewAddress(newAddress ? true : true);
  };
  return (
    <>
      <div className="w-[180px] h-[50px] mt-4 mb-5">
        <button
          onClick={addNewAddressHandler}
          type="button"
          className="yellow-btn rounded"
        >
          <div className="w-full text-sm font-semibold">
            {ServeLangItem()?.Add_New_Address}
          </div>
        </button>
      </div>
      {newAddress && (
        <div data-aos="zoom-in" className="w-full">
          <div className="flex justify-between items-center">
            <h1 className="sm:text-2xl text-xl text-qblack font-medium mb-5">
              {ServeLangItem()?.Add_New_Address}
            </h1>
            <span
              onClick={() => setNewAddress(!newAddress)}
              className="text-qyellow cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          <div className="form-area">
            <form>
              <div className="mb-6">
                <div className="w-full  mb-5 sm:mb-0">
                  <InputCom
                    label={ServeLangItem()?.Name + "*"}
                    placeholder="Name"
                    inputClasses="w-full h-[50px]"
                    value={fName}
                    inputHandler={(e) => setFname(e.target.value)}
                    error={!!(errors && Object.hasOwn(errors, "name"))}
                  />
                </div>
                {errors && Object.hasOwn(errors, "name") ? (
                  <span className="text-sm mt-1 text-qred">
                    {errors.name[0]}
                  </span>
                ) : (
                  ""
                )}
              </div>

              <div className="flex rtl:space-x-reverse space-x-5 items-center mb-6">
                <div className="sm:w-1/2 w-full">
                  <InputCom
                    label={ServeLangItem()?.Email + "*"}
                    placeholder={ServeLangItem()?.Email}
                    inputClasses="w-full h-[50px]"
                    value={email}
                    inputHandler={(e) => setEmail(e.target.value)}
                    error={!!(errors && Object.hasOwn(errors, "email"))}
                  />
                  {errors && Object.hasOwn(errors, "email") ? (
                    <span className="text-sm mt-1 text-qred">
                      {errors.email[0]}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="sm:w-1/2 w-full">
                  <InputCom
                    label={ServeLangItem()?.Phone_Number + "*"}
                    placeholder="012 3  *******"
                    inputClasses="w-full h-[50px]"
                    value={phone}
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
                </div>
              </div>
              <div className="mb-6">
                <h1 className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
                  {ServeLangItem()?.Country}*
                </h1>
                <div
                  className={`w-full h-[50px] border px-5 flex justify-between items-center border-qgray-border mb-2 ${
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
                            (item) => parseInt(item.id) === parseInt(country)
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
              <div className="flex rtl:space-x-reverse space-x-5 items-center mb-6">
                <div className="w-1/2">
                  <h1 className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
                    {ServeLangItem()?.State}*
                  </h1>
                  <div
                    className={`w-full h-[50px] border px-5 flex justify-between items-center border-qgray-border mb-2 ${
                      !!(errors && Object.hasOwn(errors, "state"))
                        ? "border-qred"
                        : "border-qgray-border"
                    }`}
                  >
                    <Selectbox
                      action={getcity}
                      className="w-full"
                      defaultValue={
                        stateDropdown &&
                        stateDropdown.length > 0 &&
                        (function () {
                          let item = stateDropdown.find(
                            (item) => item.id === parseInt(state)
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
                <div className="w-1/2">
                  <h1 className="input-label capitalize block  mb-2 text-qgray text-[13px] font-normal">
                    {ServeLangItem()?.City}*
                  </h1>
                  <div
                    className={`w-full h-[50px] border px-5 flex justify-between items-center border-qgray-border mb-2 ${
                      !!(errors && Object.hasOwn(errors, "city"))
                        ? "border-qred"
                        : "border-qgray-border"
                    }`}
                  >
                    <Selectbox
                      action={selectCity}
                      className="w-full"
                      defaultValue={
                        cityDropdown &&
                        cityDropdown.length > 0 &&
                        (function () {
                          let item = cityDropdown.find(
                            (item) => item.id === parseInt(city)
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
              <div className=" mb-6">
                <div className="w-full">
                  <InputCom
                    value={address}
                    inputHandler={(e) => setAddress(e.target.value)}
                    label="Address"
                    placeholder="Your Address here"
                    inputClasses="w-full h-[50px]"
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

              <div className="flex rtl:space-x-reverse space-x-5 items-center ">
                <div className="flex rtl:space-x-reverse space-x-2 items-center mb-10">
                  <div>
                    <input
                      checked={home}
                      onChange={() => {
                        setHome(!home);
                        setOffice(false);
                      }}
                      type="checkbox"
                      name="home"
                      id="home"
                    />
                  </div>
                  <label
                    htmlFor="home"
                    className="text-qblack text-[15px] select-none capitalize"
                  >
                    {ServeLangItem()?.home}
                  </label>
                </div>
                <div className="flex rtl:space-x-reverse space-x-2 items-center mb-10">
                  <div>
                    <input
                      checked={office}
                      onChange={() => {
                        setOffice(!office);
                        setHome(false);
                      }}
                      type="checkbox"
                      name="office"
                      id="office"
                    />
                  </div>
                  <label
                    htmlFor="office"
                    className="text-qblack text-[15px] select-none"
                  >
                    {ServeLangItem()?.Office}
                  </label>
                </div>
              </div>
              {editAdd ? (
                <button
                  onClick={() => updateAddress(editAdd)}
                  type="button"
                  className="w-full h-[50px]"
                >
                  <div className="yellow-btn  rounded">
                    <span className="text-sm text-qblack">
                      {ServeLangItem()?.Update_address}
                    </span>
                    {loading && (
                      <span
                        className="w-5 "
                        style={{ transform: "scale(0.3)" }}
                      >
                        <LoaderStyleOne />
                      </span>
                    )}
                  </div>
                </button>
              ) : (
                <button
                  onClick={saveAddress}
                  type="button"
                  className="w-full h-[50px]"
                >
                  <div className="yellow-btn  rounded">
                    <span className="text-sm text-qblack">
                      {ServeLangItem()?.Save_Address}
                    </span>
                    {loading && (
                      <span
                        className="w-5 "
                        style={{ transform: "scale(0.3)" }}
                      >
                        <LoaderStyleOne />
                      </span>
                    )}
                  </div>
                </button>
              )}
            </form>
          </div>
        </div>
      )}
      {!newAddress && (
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-[30px]">
          {addresses &&
            addresses.length > 0 &&
            addresses.map((item, index) => (
              <div
                key={index}
                className="w-full bg-primarygray rounded p-5 border"
              >
                <div className="flex justify-between items-center">
                  <p className="title text-[22px] font-semibold">
                    {ServeLangItem()?.Address} #{index + 1}
                  </p>
                  <div className="flex rtl:space-x-reverse space-x-2.5 items-center">
                    <button
                      onClick={() => editAddress(item.id)}
                      type="button"
                      className="border border-qgray text-qyellow w-[34px] h-[34px] rounded-full flex justify-center items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteAddress(item.id)}
                      type="button"
                      className="border border-qgray w-[34px] h-[34px] rounded-full flex justify-center items-center"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 17 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.7768 5.95215C15.6991 6.9104 15.6242 7.84603 15.5471 8.78237C15.3691 10.9285 15.1917 13.0747 15.0108 15.2209C14.9493 15.9473 14.9097 16.6773 14.8065 17.3988C14.6963 18.1726 14.0716 18.7161 13.2929 18.7196C10.3842 18.7323 7.47624 18.7337 4.56757 18.7189C3.70473 18.7146 3.08639 18.0794 3.00795 17.155C2.78181 14.493 2.57052 11.8302 2.35145 9.16821C2.2716 8.19442 2.1875 7.22133 2.10623 6.24824C2.09846 6.15638 2.09563 6.06451 2.08998 5.95286C6.65579 5.95215 11.2061 5.95215 15.7768 5.95215ZM5.25375 8.05803C5.25234 8.05803 5.25163 8.05803 5.25022 8.05803C5.27566 8.4573 5.3011 8.85657 5.32583 9.25584C5.46717 11.5228 5.60709 13.7891 5.75125 16.0561C5.77245 16.3897 5.99081 16.6038 6.28196 16.6024C6.58724 16.601 6.80066 16.3636 6.8056 16.0159C6.80702 15.9339 6.80136 15.8512 6.79571 15.7692C6.65367 13.4789 6.51304 11.1886 6.36888 8.89826C6.33849 8.41702 6.31164 7.93507 6.26146 7.45524C6.22966 7.1549 6.0318 6.99732 5.73076 6.99802C5.44526 6.99873 5.24033 7.2185 5.23043 7.52873C5.22619 7.7054 5.24598 7.88207 5.25375 8.05803ZM12.6102 8.05521C12.6088 8.05521 12.6074 8.05521 12.606 8.05521C12.6152 7.89055 12.6321 7.7259 12.6307 7.56195C12.6286 7.24465 12.4399 7.02417 12.1622 6.99873C11.888 6.97329 11.6484 7.16268 11.5961 7.46443C11.5665 7.63756 11.5615 7.81494 11.5502 7.9909C11.4626 9.38799 11.3749 10.7851 11.2887 12.1822C11.2103 13.4499 11.1276 14.7184 11.0576 15.9869C11.0379 16.3431 11.2463 16.5819 11.5495 16.6003C11.8562 16.6194 12.088 16.4017 12.1099 16.0505C12.2788 13.3856 12.4441 10.7208 12.6102 8.05521ZM9.45916 11.814C9.45916 10.4727 9.45986 9.13147 9.45916 7.79091C9.45916 7.25101 9.28603 6.99449 8.92845 6.99661C8.56805 6.99802 8.40198 7.24819 8.40198 7.79586C8.40127 10.4664 8.40127 13.1369 8.40268 15.8074C8.40268 15.948 8.37088 16.1289 8.44296 16.2194C8.56946 16.3763 8.76591 16.5748 8.93198 16.5741C9.09805 16.5734 9.29309 16.3727 9.41746 16.2151C9.48955 16.124 9.45704 15.9431 9.45704 15.8032C9.46057 14.4725 9.45916 13.1432 9.45916 11.814Z"
                          fill="#EB5757"
                        />
                        <path
                          d="M5.20143 2.75031C5.21486 2.49449 5.21839 2.2945 5.23747 2.09593C5.31733 1.25923 5.93496 0.648664 6.77449 0.637357C8.21115 0.618277 9.64923 0.618277 11.0859 0.637357C11.9254 0.648664 12.5438 1.25852 12.6236 2.09522C12.6427 2.2938 12.6462 2.49379 12.6582 2.73335C12.7854 2.739 12.9084 2.74889 13.0314 2.7496C13.9267 2.75101 14.8221 2.74677 15.7174 2.75172C16.4086 2.75525 16.8757 3.18774 16.875 3.81244C16.8742 4.43643 16.4078 4.87103 15.716 4.87174C11.1926 4.87386 6.66849 4.87386 2.14508 4.87174C1.45324 4.87103 0.986135 4.43713 0.985429 3.81314C0.984722 3.18915 1.45183 2.75525 2.14296 2.75243C3.15421 2.74677 4.16545 2.75031 5.20143 2.75031ZM11.5799 2.73335C11.5799 2.59625 11.5806 2.49096 11.5799 2.38637C11.5749 1.86626 11.4018 1.69313 10.876 1.69242C9.55878 1.69101 8.24225 1.68959 6.92501 1.69313C6.48546 1.69454 6.30031 1.87545 6.28265 2.3051C6.27699 2.4422 6.28194 2.58 6.28194 2.73335C8.05851 2.73335 9.7941 2.73335 11.5799 2.73335Z"
                          fill="#EB5757"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-5">
                  <table>
                    <tbody>
                      <tr className="flex mb-3">
                        <td className="text-base text-qgraytwo w-[70px] block line-clamp-1 capitalize">
                          <p>{ServeLangItem()?.Name}:</p>
                        </td>
                        <td className="text-base text-qblack line-clamp-1 font-medium">
                          {item.name}
                        </td>
                      </tr>
                      <tr className="flex mb-3">
                        <td className="text-base text-qgraytwo w-[70px] block line-clamp-1 capitalize">
                          <p>{ServeLangItem()?.Email}:</p>
                        </td>
                        <td className="text-base text-qblack line-clamp-1 font-medium">
                          {item.email}
                        </td>
                      </tr>
                      <tr className="flex mb-3">
                        <td className="text-base text-qgraytwo w-[70px] block line-clamp-1 capitalize">
                          <p>{ServeLangItem()?.phone}:</p>
                        </td>
                        <td className="text-base text-qblack line-clamp-1 font-medium">
                          {item.phone}
                        </td>
                      </tr>
                      <tr className="flex mb-3">
                        <td className="text-base text-qgraytwo w-[70px] block line-clamp-1 capitalize">
                          <p>{ServeLangItem()?.Country}:</p>
                        </td>
                        <td className="text-base text-qblack line-clamp-1 font-medium">
                          {item.country.name}
                        </td>
                      </tr>
                      <tr className="flex mb-3">
                        <td className="text-base text-qgraytwo w-[70px] block line-clamp-1 capitalize">
                          <p>{ServeLangItem()?.State}:</p>
                        </td>
                        <td className="text-base text-qblack line-clamp-1 font-medium">
                          {item.country_state.name}
                        </td>
                      </tr>
                      <tr className="flex mb-3">
                        <td className="text-base text-qgraytwo w-[70px] block line-clamp-1 capitalize">
                          <p>{ServeLangItem()?.City}:</p>
                        </td>
                        <td className="text-base text-qblack line-clamp-1 font-medium">
                          {item.city.name}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
