/**
 * Redux Store Configuration
 *
 * Central Redux store using Redux Toolkit with combined reducers
 * for auth, cart, and product state management.
 */
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import themeReducer from "./slices/themeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    theme: themeReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore serialization warnings for certain action paths
        ignoredActions: ["auth/login/fulfilled", "auth/register/fulfilled"],
      },
    }),

  devTools: process.env.NODE_ENV !== "production",
});

export default store;
