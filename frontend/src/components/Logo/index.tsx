import { Stack, Typography } from "@mui/material";
import Image from "next/image";

interface ILogoProps {
  size: number;
  className?: string;
}

export default function Logo({ size, className }: ILogoProps) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} width={"100%"}>
      <Image
        className={`Logo-img ${className}`}
        src="/assets/images/bus.svg"
        alt="logo"
        width={size ?? 100}
        height={size ?? 100}
      />
      <Typography variant="h4" fontWeight="bold" textAlign={"right"} whiteSpace={"pre-line"}>Busão Escolar</Typography>
    </Stack>
  );
}
