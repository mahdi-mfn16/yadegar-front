import { CartItemType, CartState } from "@/types/cartItemType";
import { MenuItemOptionType } from "@/types/exampleType";
import { createSlice } from "@reduxjs/toolkit";

const initialState: CartState = {
    items: [],
    totalPrice: 0,
    itemCount: 0
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.items.find((item) => {
                return action.payload.option_id ? (action.payload.item.id === item.item.id && action.payload.option_id === item.option_id) :  (action.payload.item.id === item.item.id)
            });

            if(existingItem){
                existingItem.qty += action.payload.qty
            }else{
                const cartItem = action.payload.option_id ? {
                    item: action.payload.item,
                    qty: action.payload.qty,
                    option_id: action.payload.option_id
                }: {
                    item: action.payload.item,
                    qty: action.payload.qty,
                }
                
                state.items.push(cartItem);   
            }

            state.itemCount += (existingItem ? 0 : 1);
            state.totalPrice += (
                action.payload.option_id 
                    ? action.payload.item.options.find((o:MenuItemOptionType) => o.id === action.payload.option_id).price 
                    : action.payload.item.price
                ) * action.payload.qty
            
        } ,

        removeFromCart: (state, action) => {
            const existingItem = state.items.find((item) => {
                return action.payload.option_id ? (action.payload.item.id === item.item.id && action.payload.option_id === item.option_id) :  (action.payload.item.id === item.item.id)
            });

            if(!existingItem){
                return;        
            }else{
                if(existingItem.qty - action.payload.qty > 0){
                    existingItem.qty -= action.payload.qty;
                }else{
                    state.items.filter((item) => item !== existingItem)
                    state.itemCount -= 1; 
                }
            }

            state.totalPrice -= (
                action.payload.option_id 
                    ? action.payload.item.options.find((o:MenuItemOptionType) => o.id === action.payload.option_id).price 
                    : action.payload.item.price
                ) * action.payload.qty
        } ,

        clearCart: (state) => {
            state.items = [];
            state.itemCount = 0;
            state.totalPrice = 0;
        },

        setCartFromStorage: (state, action) => {
            state.items = action.payload;
            state.itemCount = state.items.length;
            state.totalPrice = action.payload.reduce((total:number, item: any) => {
                return total + (item.option_id 
                    ? item.item.options.find((o:MenuItemOptionType) => o.id === item.option_id).price 
                    : item.item.price
                ) * item.qty
            } , 0)
        }
    }
})

export const { addToCart, removeFromCart, clearCart, setCartFromStorage} = cartSlice.actions;
export default cartSlice.reducer