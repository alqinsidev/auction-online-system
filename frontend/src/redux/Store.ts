import {
    combineReducers,
    configureStore,
  } from "@reduxjs/toolkit";
  import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    REGISTER,
    PURGE,
  } from "redux-persist";
  import AuthSlice from "./Slice/AuthSlice";
  import storage from "redux-persist/lib/storage";
  
  const persistConfig = {
    key: "root",
    storage,
  };
  
  const rootReducer = combineReducers({
    auth: AuthSlice.reducer,
  });
  
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  
  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
  
  export const persistor = persistStore(store);
  
  // Infer the `RootState` and `AppDispatch` types from the store itself
  export type RootState = ReturnType<typeof store.getState>;
  // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
  export type AppDispatch = typeof store.dispatch;