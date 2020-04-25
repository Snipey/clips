import { AppProps } from "next/app";
import React, { FunctionComponent } from "react";

import { Layout } from "../components/layout";

import "isomorphic-fetch";

import "../global.css";
import { ThemeProvider } from "styled-components";

const theme = {
  background: "#09090D",
  darker: "#1C1C1C",
  accent: "#fff",
  color: "#ffffff",
  grey: "#656d7a",
  error: "#bb3e3e",
};

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
};

export default App;
