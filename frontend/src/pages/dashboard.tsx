import { AppContext } from "@/context/appProvider";
import { IStudent } from "@/interfaces/IStudent";
import { getFromLS } from "@/utils/localStorage";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<IStudent>({} as IStudent);
  const { showMessage } = useContext(AppContext);

  useEffect(() => {
    const token = getFromLS("token");
    if (!token) {
      router.push("/");
    }
    const getUserProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/student/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data)
        setProfile(response.data);
      } catch (error: AxiosError | any) {
        // console.log('Error', error)
        if (error instanceof AxiosError) {
          showMessage(error.response?.data.message, "error");
        } else showMessage(error.message, "error");

        router.push("/");
      }
    };

    getUserProfile();
  }, []);

  return (
    <div>
      <h1>Bem vindo, {profile?.name}</h1>
    </div>
  );
}
