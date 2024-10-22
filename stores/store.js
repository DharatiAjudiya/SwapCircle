import { configureStore } from "@reduxjs/toolkit";
import RegisterSlice from "./auth/RegisterSlice";
import LoginSlice from "./auth/LoginSlice";
import AuthUserSlice from "./auth/authUserSlice";
import UserSlice from "./User/UserSlice";
import MessageSlice from "./Message/MessageSlice";
import ChatroomSlice from "./Chat/ChatroomSlice";
import ItemSlice from "./Item/ItemSlice";
import CategorySlice from "./Category/CategorySlice";
import WishListSlice from "./WishList/WishListSlice";
import ShopSlice from "./Shop/ShopSlice";
import SwapSlice from "./Swap/SwapSlice";
import HomeSlice from "./Home/HomeSlice";
import PreferenceSlice from "./Preference/PreferenceSlice";

const store = configureStore({
  reducer: {
    RegisterStore: RegisterSlice,
    LoginStore: LoginSlice,
    AuthUserStore: AuthUserSlice,
    UserStore: UserSlice,
    ItemStore: ItemSlice,
    CategoryStore: CategorySlice,
    MessageStore: MessageSlice,
    WishListStore: WishListSlice,
    ChatroomStore: ChatroomSlice,
    ShopStore: ShopSlice,
    SwapStore: SwapSlice,
    HomeStore: HomeSlice,
    PreferenceStore: PreferenceSlice,
  },
});
export default store;
