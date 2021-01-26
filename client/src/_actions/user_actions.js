import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM,
    ON_SUCCESS_BUY
} from './types';
import { USER_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit) {
    console.log('formik이 준 정보', dataToSubmit);
    const request = axios.post(`${USER_SERVER}/register`, dataToSubmit)
        .then(response => {
            console.log('/register 라우터 결과', response.data);
            return response.data
        });

    return {
        type: REGISTER_USER,
        payload: request
    }
}


export function loginUser(dataToSubmit) {
    console.log('dispatch가 준 정보', dataToSubmit);
    const request = axios.post(`${USER_SERVER}/login`, dataToSubmit)
        .then(response => {
            console.log('passport콜백함수가 준 정보', response.data)
            return response.data
        });

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth() {
    const request = axios.get(`${USER_SERVER}/auth`)
        .then(response => {
            console.log('Action 결과', response.data);
            return response.data;
        });
    
    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser() {
    const request = axios.get(`${USER_SERVER}/logout`)
        .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}


export function addToCart(id, size) {
    let body = {
        productId: id,
        size: size
    }
    const request = axios.post(`${USER_SERVER}/addToCart`, body)
        .then(response => {
            console.log('장바구니 받은결과', response.data);
            
            return response.data;
        });
        return {
            type: ADD_TO_CART,
            payload: request
        }
}


export function getCartItems(cartItems, userCart) {
    console.log('아이디 배열', cartItems);
    console.log('장바구니 정보', userCart);

    const request = axios.get(`/api/product/products_by_id?id=${cartItems}&type=array`)
    .then(response => {
        //console.log(userCart);
        //console.log(response.data.product);
        userCart.forEach((cartItem, i) => {
            response.data.product[i].productNumber = i;
            response.data.product[i].size = cartItem.size;
            response.data.product[i].quantity = cartItem.quantity;
        })
        //console.log(response.data.product);
        return response.data.product;
    })
    return {
        type: GET_CART_ITEMS,
        payload: request
    }
}

export function removeCartItem(size, productId) {
    //디스패치한테 받은 사이즈랑 품번가지고 백엔드 호출
    const request = axios.get(`/api/users/removeFromCart?id=${productId}&size=${size}`)
        .then(response => {
            console.log('백엔드에서 준 결과', response.data);
            //productInfo ,  cart 정보를 조합해서   CartDetail을 만든다. 
            response.data.cart.forEach((cartItem, i) => {
                response.data.productInfo[i].productNumber = i;
                response.data.productInfo[i].size = cartItem.size;
                response.data.productInfo[i].quantity = cartItem.quantity
            })

            console.log('로직 거친 결과', response.data.productInfo);

            return response.data.productInfo;
            
        });

    return {
        type: REMOVE_CART_ITEM,
        payload: request
    }
}

export function onSuccessBuy(data) {

    console.log('onsuccess', data);

    const request = axios.post(`/api/users/successBuy`, data)
        .then(response => response.data);

    return {
        type: ON_SUCCESS_BUY,
        payload: request
    }
}














