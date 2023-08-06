import { configureStore } from "@reduxjs/toolkit";
import websiteSetup from "./websiteSetup";
import wishlistData from "./wishlistData";
import cart from "./Cart";
import compareProduct from "./compareProduct";

export default configureStore({
  reducer: {
    websiteSetup: websiteSetup,
    wishlistData: wishlistData,
    cart: cart,
    compareProducts: compareProduct,
  },
});
