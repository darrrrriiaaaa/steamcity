import React, { createContext, useReducer, useContext, useEffect } from 'react';

const initialState = {
    user: localStorage.getItem('userInfo') 
        ? JSON.parse(localStorage.getItem('userInfo')) 
        : null,
    loading: false,
    error: null,
};

const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null,
            };
        case 'LOGOUT':
            localStorage.removeItem('userInfo');
            return {
                ...state,
                user: null,
                loading: false,
                error: null,
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};