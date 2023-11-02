import Header from "@/components/Dashboard/Header";
import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  useEffect(() => {}, []);

  return (
    <>
      <Header />
    </>
  );
}
