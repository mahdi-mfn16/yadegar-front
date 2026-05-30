import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/lib/redux/slices/cartSlice";
import authReducer from "@/lib/redux/slices/authSlice";
import { CartMiddleware } from "./middlewares/cartMiddleware";

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(CartMiddleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
