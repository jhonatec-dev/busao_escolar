import { IStudent } from "@/interfaces/IStudent";
import { getFromLS, removeFromLS, saveToLS } from "@/utils/localStorage";
import { Alert, Snackbar, ThemeProvider, createTheme } from "@mui/material";
import axios, { AxiosError } from "axios";
import router from "next/router";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AppContextType {
  themeMode: themeMode;
  toggleMode: () => void;
  showMessage: (message: string, mode: messageMode) => void;
  logout: () => void;
  login: () => void;
  profile: IStudent;
  getData: (endPoint: string, method: method, data?: any) => any;
  getDataAuth: (endPoint: string, method: method, data?: any) => any;
}

export const AppContext = createContext({} as AppContextType);
export type method = "get" | "post" | "put" | "delete" | "patch";
export type themeMode = "light" | "dark";
export type messageMode = "error" | "success" | "info" | "warning";

export default function AppProvider({ children }: any) {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [messageContent, setMessageContent] = useState("");
  const [messageMode, setMessageMode] = useState<messageMode>("info");
  const [profile, setProfile] = useState<IStudent>({} as IStudent);

  const login = useCallback(async () => {
    const token = getFromLS("tokenBusaoEscolar");
    if (!token) {
      if (router.pathname === "/dashboard") router.push("/");
      return;
    }

    const newProfile = await getDataAuth("student/profile", "get");

    if (!newProfile) return;
    setProfile(newProfile as IStudent);
    if (router.pathname === "/") router.push("/dashboard");
  }, []);

  useEffect(() => {
    restoreThemeMode();
    login();
  }, []);

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
        // styleOverrides: {
        //   root: {
        //     backdropFilter: "blur(10px) !important",
        //     margin: "0 !important",
        //     padding: "0",
        //     position: "fixed",
        //     top: "0",
        //     backgroundColor: "rgba(0, 0, 0, 0.5)",
        //     zIndex: "50",
        //   },
        // },
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

  const restoreThemeMode = () => {
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
  };

  const toggleMode = useCallback(() => {
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
  }, [themeMode]);

  const showMessage = useCallback((message: string, mode: messageMode) => {
    setMessageContent(message);
    setMessageMode(mode);
  }, []);

  const logout = useCallback(() => {
    removeFromLS("tokenBusaoEscolar");
    router.push("/");
  }, []);

  const getData = useCallback(
    async (endPoint: string, method: method, data?: any) => {
      try {
        const response = await axios[method](`${API_URL}/${endPoint}`, data);
        return response.data;
      } catch (error: AxiosError | any) {
        console.log(
          "Error",
          error,
          "instancia",
          typeof error,
          "instancia",
          error instanceof AxiosError
        );
        if (error instanceof AxiosError) {
          showMessage(error.response?.data.message, "error");
        } else showMessage(error.message, "error");

        return;
      }
    },
    [showMessage]
  );

  const getDataAuth = useCallback(
    async (endPoint: string, method: method, data?: any) => {
      try {
        const token = getFromLS("tokenBusaoEscolar");
        console.log("token", token);
        if (!token) {
          logout();
          return;
        }
        let response: any;
        console.log("dados no auth do provider", { endPoint, method, data });
        if (method === "get" || method === "delete") {
          console.log("entrei aqui");
          response = await axios[method](`${API_URL}/${endPoint}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          response = await axios[method](`${API_URL}/${endPoint}`, data ?? {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        console.log("response no Provider", response);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            logout();
          }
          throw new Error(error.response?.data.message);
        }
        throw new Error((error as Error).message);
      }
    },
    [logout]
  );

  const values = useMemo(
    () => ({
      themeMode,
      profile,
      toggleMode,
      showMessage,
      logout,
      login,
      getData,
      getDataAuth,
    }),
    [themeMode, profile]
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
