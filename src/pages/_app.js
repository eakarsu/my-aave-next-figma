import React from "react";
import Head from "next/head";
import NProgress from "nprogress";
import { Router } from "next/router";

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
        <title>Archived DeFi UI Mock</title>
        <meta name="robots" content="noindex,nofollow" />
        <link rel="icon" href="icon/aave1.ico" />
      </Head>
      <div className="archiveBoundary" role="status">
        <strong>Archived UI mock.</strong> No wallet, market data, or transaction
        path is connected. Do not use this interface for financial decisions.
      </div>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </React.Fragment>
  );
}

export default MyApp;
