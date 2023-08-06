import React from "react";
import CustomPageCom from "../../src/components/CustomPageCom";
import { useRouter } from "next/router";

export default function PageWrap() {
  const router = useRouter();
  return (
    <>
      <CustomPageCom slug={router.query.custom} />
    </>
  );
}
