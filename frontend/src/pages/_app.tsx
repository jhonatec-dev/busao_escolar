import AppProvider from "@/context/appProvider";
import "@/styles/globals.scss";
import { Paper } from "@mui/material";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Paper className="App">
        <Component {...pageProps} />
      </Paper>
    </AppProvider>
  );
}
