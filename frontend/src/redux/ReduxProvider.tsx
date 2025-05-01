'use client'
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {

    let reduxPersister = persistStore(store)

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={reduxPersister}>
                {children}
            </PersistGate>
        </Provider>
    )
}
