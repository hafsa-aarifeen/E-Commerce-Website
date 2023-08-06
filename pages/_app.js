import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import AOS from "aos";
import "aos/dist/aos.css";
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)


import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import Toaster from "../src/components/Helpers/Toaster";
import DefaultLayout from "../src/components/Partials/DefaultLayout";
import store from "../src/store/store";
import "../styles/globals.css";
import "../styles/loader.css";
import "../styles/selectbox.css";

/*page loader
 *package name:nProgress
 * github: https://github.com/rstacruz/nprogress */

import Router from "next/router";
import NProgress from "nprogress"; //nprogress module
import "nprogress/nprogress.css";
import MaintenanceWrapper from "../src/components/Partials/Headers/MaintenanceWrapper";
import MessageContext from "../src/components/Contexts/MessageContext";
import LoginContext from "../src/components/Contexts/LoginContext";
import auth from "../utils/auth";
//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
//page loader end

//font awesome
library.add(fas, fab, far);

function MyApp({ Component, pageProps }) {
  const [loginPopup, setLoginPopup] = useState(false);
  const handlerPopup = (value) => {
    setLoginPopup(value);
  };
  const [toggleMessage, setToggleMessage] = useState(false);
  const [addNewSeller, setNewSeller] = useState(null);
  const toggleHandler = (value) => {
    if(auth()){
      if(value){
        setNewSeller(value)
      }else{
        setNewSeller(null);
      }
      setToggleMessage(!toggleMessage);
    }
  };
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <>
      <Provider store={store}>
        <MessageContext.Provider
            value={{ toggle: toggleMessage, toggleHandler: toggleHandler,newSeller:addNewSeller }}
        >
          <LoginContext.Provider
              value={{ loginPopup: loginPopup, handlerPopup: handlerPopup }}
          >
            <DefaultLayout>
              <MaintenanceWrapper>
                <Component {...pageProps} />
              </MaintenanceWrapper>
            </DefaultLayout>
          </LoginContext.Provider>
        </MessageContext.Provider>
      </Provider>
      <Toaster />
    </>
  );
}

export default MyApp;
