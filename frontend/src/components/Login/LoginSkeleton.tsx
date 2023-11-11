import { Skeleton, Stack } from "@mui/material";

export default function LoginSkeleton() {
  return (
    <Stack spacing={2} alignItems={"flex-end"} width={"400px"}>
      <Skeleton
        animation="wave"
        variant="rectangular"
        width="100%"
        height={25}
      />
      <Skeleton animation="wave" variant="rectangular" width="100%" />
      <Skeleton
        animation="wave"
        variant="rectangular"
        width="100%"
        height={80}
      />
      <Skeleton
        animation="wave"
        variant="rectangular"
        width="50%"
        height={40}
      />
    </Stack>
  );
}
