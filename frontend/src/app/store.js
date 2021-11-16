import {applyMiddleware, combineReducers, compose, configureStore} from "@reduxjs/toolkit";
import userReducer from '../features/userSlice';

import thunk from 'redux-thunk'
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {createStore} from "redux"; // defaults to localStorage for web


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user']
}

const rootReducer = combineReducers({
    user: userReducer,
});

//
// const middlewares = [];
//
const composerEnhance = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//
// const store = createStore(
//     rootReducer,
//     composerEnhance(applyMiddleware(...middlewares))
// )
//
// const persistor = persistStore(store);
//
// export { store, persistor };


const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer, composerEnhance(applyMiddleware(thunk)));

export const persistedStore = persistStore(store)