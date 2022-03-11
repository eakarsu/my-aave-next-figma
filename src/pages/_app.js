import React from "react";
import { Provider } from "react-redux";
import Web3 from 'web3'
import Head from "next/head";
import NProgress from "nprogress";
import { Router } from "next/router";
import store from '../store/store'
import { Web3ContextProvider } from "../hooks/web3";
import AppLayout from "../components/Layout/AppLayout/AppLayout";

// import styles
import "../styles/globals.css";


NProgress.configure({ showSpinner: false });

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {

  return (    
        <React.Fragment>          
          <Head>
            <title>AAVE</title>
            <link rel="icon" href="icon/aave1.ico" />
          </Head>
          <Provider store={store}>
            {(typeof window !== "undefined")&&
              <Web3ContextProvider>
              <AppLayout>
                  <Component {...pageProps} />                
              </AppLayout>
            </Web3ContextProvider>              
            }
          </Provider>
        </React.Fragment>
    
  );
}

export default MyApp;
