import React, { Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/redux/store/store";
import AppRoutes from "./routes";
import Loader from "./components/Loader/Loader";
import loaderService from "./utils/loaderService";
import NetworkStatus from "./components/networkStatus/NetworkStatus";


const App = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = loaderService.subscribe((loadingState) => {
      setIsLoading(loadingState);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      {/* Network Status Notification */}
      <NetworkStatus />
      
      {isLoading && <Loader />}
      
      <Router>
        <Suspense fallback={<Loader />}>
          <AppRoutes />
        </Suspense>
      </Router>
    </Provider>
  );
};

export default App;