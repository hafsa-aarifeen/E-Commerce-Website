import Accodion from "../Helpers/Accodion";
import InputCom from "../Helpers/InputCom";
import PageTitle from "../Helpers/PageTitle";
import Layout from "../Partials/Layout";
import { useState } from "react";
import apiRequest from "../../../utils/apiRequest";
import LoaderStyleOne from "../Helpers/Loaders/LoaderStyleOne";
import { toast } from "react-toastify";
import ServeLangItem from "../Helpers/ServeLangItem";
export default function Faq({ datas }) {
  const { faqs } = datas;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const sendHandler = () => {
    setLoading(true);
    apiRequest
      .contact({
        name: name,
        email: email,
        subject: subject,
        message: message,
      })
      .then((res) => {
        setLoading(false);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        toast.success(res && res.data.notification);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        setErrors(err.response.data.errors);
      });
  };

  return (
    <Layout childrenClasses="pt-0 pb-0">
      <div className="faq-page-wrapper w-full mb-10">
        <div className="page-title w-full">
          <PageTitle
            title={ServeLangItem()?.Frequently_asked_questions}
            breadcrumb={[
              { name: ServeLangItem()?.home, path: "/" },
              { name: ServeLangItem()?.FAQ, path: "/faq" },
            ]}
          />
        </div>
      </div>
      <div className="contact-wrapper w-full mb-10">
        <div className="container-x mx-auto">
          <div className="main-wrapper w-full lg:flex lg:space-x-[30px] rtl:space-x-reverse">
            <div className="lg:w-1/2 w-full mb-10 lg:mb-0">
              <h1 className="text-qblack font-bold text-[22px] mb-4">
                {ServeLangItem()?.Frequently_asked_questions}
              </h1>
              <div className="flex flex-col space-y-7 justify-between">
                {faqs.map((faq) => (
                  <Accodion
                    key={faq.id}
                    title={faq.question}
                    des={faq.answer}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white sm:p-10 p-5">
                <div className="title flex flex-col items-center">
                  <h1 className="lg:text-[34px] text-xl font-bold text-qblack">
                    {ServeLangItem()?.Have_Any_Qustion}
                  </h1>
                  <span className="-mt-3 block">
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
                  </span>
                </div>
                <div className="inputs mt-5">
                  <div className="mb-4">
                    <InputCom
                      label={ServeLangItem()?.Name + "*"}
                      placeholder={ServeLangItem()?.Name}
                      name="first_name"
                      inputClasses="h-[50px]"
                      value={name}
                      inputHandler={(e) => setName(e.target.value)}
                      error={!!(errors && Object.hasOwn(errors, "name"))}
                    />
                    {errors && Object.hasOwn(errors, "name") ? (
                      <span className="text-sm mt-1 text-qred">
                        {errors.name[0]}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mb-4">
                    <InputCom
                      label={ServeLangItem()?.Email_Address + "*"}
                      placeholder={ServeLangItem()?.Email_Address}
                      name="email"
                      inputClasses="h-[50px]"
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
                  <div className="mb-4">
                    <InputCom
                      label={ServeLangItem()?.Subject + "*"}
                      placeholder={ServeLangItem()?.Subject}
                      name="subject"
                      inputClasses="h-[50px]"
                      value={subject}
                      error={!!(errors && Object.hasOwn(errors, "subject"))}
                      inputHandler={(e) => setSubject(e.target.value)}
                    />
                    {errors && Object.hasOwn(errors, "subject") ? (
                      <span className="text-sm mt-1 text-qred">
                        {errors.subject[0]}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="mb-5">
                    <h6 className="input-label text-qgray capitalize text-[13px] font-normal block mb-2 ">
                      {ServeLangItem()?.Message}*
                    </h6>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here"
                      className={` w-full h-[105px] focus:ring-0 focus:outline-none p-3 border placeholder:text-sm ${
                        !!(errors && Object.hasOwn(errors, "message"))
                          ? "border-qred"
                          : "border-qgray-border"
                      }`}
                    ></textarea>
                    {errors && Object.hasOwn(errors, "message") ? (
                      <span className="text-sm mt-1 text-qred">
                        {errors.message[0]}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div>
                    <button
                      disabled={
                        name && email && subject && message ? false : true
                      }
                      onClick={sendHandler}
                      type="button"
                      className="disabled:bg-gray-400 disabled:cursor-not-allowed bg-qblack text-white text-sm font-semibold w-full h-[50px] flex justify-center items-center"
                    >
                      <span>{ServeLangItem()?.Send_Now}</span>
                      {loading && (
                        <span
                          className="w-5"
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
          </div>
        </div>
      </div>
    </Layout>
  );
}
