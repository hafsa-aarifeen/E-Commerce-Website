import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import auth from "../../utils/auth";
const initialState = {
  compareProducts: null,
  status: null,
};
export const fetchCompareProducts = createAsyncThunk(
  "COMPARE/fetchCompareProducts",
  async () => {
    if (auth()) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/user/compare-product?token=${
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
  }
);

export const compareAction = createSlice({
  name: "COMPARE",
  initialState,
  extraReducers: {
    [fetchCompareProducts.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchCompareProducts.fulfilled]: (state, { payload }) => {
      (state.compareProducts = payload), (state.status = "success");
    },
    [fetchCompareProducts.rejected]: (state, action) => {
      state.status = "failed";
    },
  },
});

// Action creators are generated for each case reducer function
// export const { SET_WISHLIST_ACTION } = wishlistAction.actions;

export default compareAction.reducer;
