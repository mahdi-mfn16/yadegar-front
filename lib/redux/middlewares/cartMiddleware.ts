import { Middleware } from "@reduxjs/toolkit";

export const CartMiddleware: Middleware = (store) => (next) => (action: any) => {
    const result = next(action);
    
    if(
        action.type === 'cart/addToCart' || 
        action.type === 'cart/removeFromCart' || 
        action.type === 'cart/clearCart'
    ){
        const {cart} = store.getState();
        localStorage.setItem('resaurant-cart', JSON.stringify(cart.items));
    }

    return result;
}