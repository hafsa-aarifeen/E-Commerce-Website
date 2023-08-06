/* eslint-disable react/display-name */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Maintain from "../src/components/Maintain";
const isMaintainance = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter();
    const { websiteSetup } = useSelector((state) => state.websiteSetup);
    const [mode, setMode] = useState(null);
    useEffect(() => {
      if (websiteSetup) {
        if (websiteSetup.payload) {
          if (websiteSetup.payload.maintainance) {
            setMode(parseInt(websiteSetup.payload.maintainance.status));
          }
        }
      }
    });

    // useEffect(() => {
    //   if (mode === 1) {
    //     Router.replace("/maintenance");
    //   } else {
    //     return;
    //   }
    // }, [Router, mode]);
    if (mode === 0) {
      return <WrappedComponent {...props} />;
    } else if (mode === 1) {
      return <Maintain />;
    } else {
      return false;
    }
  };
};

export default isMaintainance;
