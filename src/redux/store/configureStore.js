// configureStore.js
import { configureStore as configStore } from "@reduxjs/toolkit";
import rootReducer from "../rootReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ['auth'], // Only persist auth, not student data
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const configureStore = () => {
  const store = configStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production',
  });

  const persister = persistStore(store);
  return { store, persister };
};

export default configureStore;