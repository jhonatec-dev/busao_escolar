import { IStudent } from "@/interfaces/IStudent";
import { getFromLS, removeFromLS, saveToLS } from "@/utils/localStorage";
import { Alert, Snackbar, ThemeProvider, createTheme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";

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
  studentView: boolean;
  setStudentView: (studentView: boolean) => void;
  loginLoading: boolean;
  setLoginLoading: (loginLoading: boolean) => void;
}

export const AppContext = createContext({} as AppContextType);
export type method = "get" | "post" | "put" | "delete" | "patch";
export type themeMode = "light" | "dark";
export type messageMode = "error" | "success" | "info" | "warning";

export default function AppProvider({ children }: any) {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [messageContent, setMessageContent] = useState<string>("oi");
  const [messageMode, setMessageMode] = useState<messageMode>("info");
  const [profile, setProfile] = useState<IStudent>({} as IStudent);
  const [studentView, setStudentView] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  const login = async () => {
    try {
      const token = getFromLS("tokenBusaoEscolar");
      if (!token) {
        if (router.pathname === "/dashboard") router.push("/");
        return;
      }

      const newProfile = await getDataAuth("student/profile", "get");

      if (!newProfile) return;
      setProfile(newProfile as IStudent);
      if (router.pathname === "/") router.push("/dashboard");
    } catch (error) {
      setLoginLoading(false);
      throw new Error((error as Error).message);
    }
  };

  useEffect(() => {
    try {
      restoreThemeMode();
      setMessageContent("");
      login();
    } catch (error) {
      showMessage((error as Error).message, "error");
    }
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
            boxShadow: "none",
          },
          elevation2: {
            backgroundColor: themeMode === "light" ? "#ffffff" : "#232323",
            boxShadow: "none",
          },
          outlined: {
            boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.2)",
            borderColor: themeMode === "light" ? "#b7b7b7" : "#6c6c6c",
            backgroundColor: themeMode === "light" ? "#e9e9e9" : "#232323",
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

  const getData = async (endPoint: string, method: method, data?: any) => {
    try {
      const response = await axios[method](`${API_URL}/${endPoint}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.message);
      }
      throw new Error((error as Error).message);
    }
  };

  const getDataAuth = useCallback(
    async (endPoint: string, method: method, data?: any) => {
      try {
        const token = getFromLS("tokenBusaoEscolar");
        // console.log("token", token);
        if (!token) {
          logout();
          return;
        }
        let response: any;
        if (method === "get" || method === "delete") {
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
      studentView,
      setStudentView,
      loginLoading,
      setLoginLoading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [themeMode, profile, studentView, loginLoading]
  );

  return (
    <AppContext.Provider value={values}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <ThemeProvider theme={theme}>
          <>
            {children}

            <Snackbar
              open={!!messageContent && messageContent.length > 0}
              autoHideDuration={2500}
              onClose={() => setTimeout(() => setMessageContent(""), 500)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={() => setTimeout(() => setMessageContent(""), 500)}
                severity={messageMode}
                variant="filled"
                sx={{ width: "100%" }}
              >
                {messageContent}
              </Alert>
            </Snackbar>
          </>
        </ThemeProvider>
      </LocalizationProvider>
    </AppContext.Provider>
  );
}
