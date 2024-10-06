import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { wrapper } from "@/redux/store";
import { Provider } from "react-redux";
const App = ({ Component, ...rest }: AppProps) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

  return (
    <div className="flex min-h-screen w-full">
      <Provider store={store}>
          <Component {...pageProps} />
      </Provider>
    </div>
  );
};

export default App;
