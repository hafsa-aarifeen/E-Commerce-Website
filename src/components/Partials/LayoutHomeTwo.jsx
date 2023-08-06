import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DiscountBanner from "../HomeTwo/DiscountBanner";
import Drawer from "../Mobile/Drawer";
import Footer from "./Footers/FooterTwo";
import HeaderTwo from "./Headers/HeaderTwo";

export default function LayoutHomeTwo({ children, childrenClasses }) {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [settings, setSettings] = useState(null);
  const [subscribeData, setSubScribeDAta] = useState(null);
  useEffect(() => {
    if (!subscribeData) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}api/`)
        .then((res) => {
          if (res.data) {
            setSubScribeDAta(res.data.subscriptionBanner);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [subscribeData]);
  useEffect(() => {
    if (websiteSetup) {
      setSettings(websiteSetup.payload.setting);
    }
  }, [websiteSetup]);
  const [drawer, setDrawer] = useState(false);
  return (
    <>
      <Drawer open={drawer} action={() => setDrawer(!drawer)} />
      <div className="w-full overflow-x-hidden">
        <HeaderTwo
          settings={settings}
          drawerAction={() => setDrawer(!drawer)}
        />
        <div className={`w-full  ${childrenClasses || "pt-[30px] pb-[60px]"}`}>
          {children && children}
        </div>
        {subscribeData && <DiscountBanner datas={subscribeData} />}
        <Footer settings={settings} />
      </div>
    </>
  );
}
