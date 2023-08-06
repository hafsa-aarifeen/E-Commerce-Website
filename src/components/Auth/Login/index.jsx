import isAuth from "../../../../Middleware/isAuth";
import LoginLayout from "./LoginLayout";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import LoginWidget from "./LoginWidget";
function Login({ isLayout = true }) {
  const { websiteSetup } = useSelector((state) => state.websiteSetup);
  const [imgThumb, setImgThumb] = useState(null);
  useEffect(() => {
    if (websiteSetup) {
      setImgThumb(websiteSetup.payload.image_content.login_image);
    }
  }, [websiteSetup]);
  if (isLayout) {
    return (
      <LoginLayout imgThumb={imgThumb}>
        <LoginWidget />
      </LoginLayout>
    );
  } else {
    return <LoginLayout />;
  }
}

export default isAuth(Login);
