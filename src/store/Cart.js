import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import auth from "../../utils/auth";
//constant
const CART = "CART";
//intialState
const initialState = {
  cart: null,
  status: null,
};
//fetch data from api
export const fetchCart = createAsyncThunk("CART/fetchCart", async () => {
  if (auth()) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/cart?token=${
        auth().access_token
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    return data;
  }
  return false;
});
//create action and reducer
export const cart = createSlice({
  name: CART,
  initialState,
  extraReducers: {
    [fetchCart.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchCart.fulfilled]: (state, { payload }) => {
      state.cart = payload;
      state.status = "success";
    },
    [fetchCart.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});
export default cart.reducer;
