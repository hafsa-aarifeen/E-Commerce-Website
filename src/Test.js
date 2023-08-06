import React, { useEffect, useState } from "react";
import apiRequest from "../utils/apiRequest";
export default function Test() {
  const [data, setData] = useState(null);
  useEffect(() => {
    apiRequest.basicInfo().then((res) => console.log(res));

    // axios
    //   .get(`${process.env.NEXT_PUBLIC_BASE_URL}website-setup`)
    //   .then((res) => console.log(res));
  }, []);
  return (
      <>
      <div>suvo</div>
    </>
  );
}
