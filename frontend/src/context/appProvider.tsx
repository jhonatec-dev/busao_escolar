import { getFromLS, removeFromLS, saveToLS } from "@/utils/localStorage";
import { Alert, Snackbar, ThemeProvider, createTheme } from "@mui/material";
import router from "next/router";
import { createContext, useEffect, useMemo, useState } from "react";

export interface AppContextType {
  themeMode: themeMode;
  toggleMode: () => void;
  showMessage: (message: string, mode: messageMode) => void;
  logout: () => void;
}

export const AppContext = createContext({} as AppContextType);

export type themeMode = "light" | "dark";
export type messageMode = "error" | "success" | "info" | "warning";

export default function AppProvider({ children }: any) {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [messageContent, setMessageContent] = useState("");
  const [messageMode, setMessageMode] = useState<messageMode>("info");

  const theme = createTheme({
    palette: {
      mode: themeMode,
      text: {
        primary: themeMode === "light" ? "#545454" : "#e3e3e3",
        // secondary: mode === "light" ? "#b7b7b7" : "#6c6c6c",
      },
    },
    components: {
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(10px) !important",
            margin: "0 !important",
            padding: "0",
            position: "fixed",
            top: "0",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "50",
          },
        },
      },
      // MuiButton: {
      //   styleOverrides: {
      //     root: {
      //       backgroundColor: mode === "light" ? "#737373" : "#424242",
      //       color: mode === "light" ? "#d9d9d9" : "#e3e3e3",
      //       fontFamily: "Carisma-400",
      //       // textTransform: "none",
      //       fontSize: "1.2rem",
      //       "&:hover": {
      //         backgroundColor: mode === "light" ? "#b7b7b7" : "#6c6c6c",
      //         color: mode === "light" ? "#545454" : "#e3e3e3",
      //         "&:icon": {
      //           color: mode === "light" ? "#000" : "#000",
      //         },
      //       },
      //       "& .MuiSvgIcon-root": {
      //         color: mode === "light" ? "#545454" : "#e3e3e3",
      //       },
      //     },
      //   },
      // },

      MuiStack: {
        styleOverrides: {
          root: {
            marginLeft: "0 !important",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: themeMode === "light" ? "#d9d9d9" : "#1e1e1e",
          },
          elevation2: {
            backgroundColor: themeMode === "light" ? "#e9e9e9" : "#232323",
            boxShadow: "none",
          },
        },
      },
      // MuiTypography: {
      //   styleOverrides: {
      //     root: {
      //       fontFamily: "Carisma-400",
      //     },
      //     h5: {
      //       color: mode === "light" ? "#545454" : "#e3e3e3",
      //     },
      //   },
      // },
    },
  });

  useEffect(() => {
    const newThemeMode = getFromLS("themeMode") || "light";
    setThemeMode(newThemeMode);
    document.documentElement.style.setProperty(
      "--scrollbar-background",
      `var(--background-${newThemeMode})`
    );
    document.documentElement.style.setProperty(
      "--scrollbar-thumb",
      `var(--thumb-${newThemeMode})`
    );
    document.documentElement.style.setProperty(
      "--thumb-hover",
      `var(--thumb-hover-${newThemeMode})`
    );
    document.documentElement.style.setProperty(
      "--font-color-light",
      `var(--font-color-highlight-${newThemeMode})`
    );
  }, []);

  const toggleMode = () => {
    const newMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newMode);
    document.documentElement.style.setProperty(
      "--scrollbar-background",
      `var(--background-${newMode})`
    );
    document.documentElement.style.setProperty(
      "--scrollbar-thumb",
      `var(--thumb-${newMode})`
    );
    document.documentElement.style.setProperty(
      "--thumb-hover",
      `var(--thumb-hover-${newMode})`
    );
    document.documentElement.style.setProperty(
      "--font-color-light",
      `var(--font-color-highlight-${newMode})`
    );
    saveToLS("themeMode", newMode);
  };

  const showMessage = (message: string, mode: messageMode) => {
    setMessageContent(message);
    setMessageMode(mode);
  };

  const logout = () => {
    removeFromLS("token");
    router.push("/");
  };

  const values = useMemo(
    () => ({
      themeMode,
      toggleMode,
      showMessage,
      logout,
    }),
    [themeMode]
  );

  return (
    <AppContext.Provider value={values}>
      <ThemeProvider theme={theme}>
        {children}
        <Snackbar
          open={messageContent.length > 0}
          autoHideDuration={2500}
          onClose={() => setMessageContent("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setMessageContent("")}
            severity={messageMode}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {messageContent}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </AppContext.Provider>
  );
}
