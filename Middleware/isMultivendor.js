/* eslint-disable react/display-name */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import settings from "../utils/settings";
const isMultivendor = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter();
    const [isActiveMultivendor, setIsActiveMultivendor] = useState(false);
    const { enable_multivendor } = settings();
    useEffect(() => {
      const multivendor = !!(
        enable_multivendor && parseInt(enable_multivendor) === 1
      );

      if (!multivendor) {
        Router.replace("/");
      } else {
        setIsActiveMultivendor(true);
      }
    }, [Router]);
    // console.log(checkAuth);
    // console.log(isActiveMultivendor);
    if (isActiveMultivendor) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };
};

export default isMultivendor;
