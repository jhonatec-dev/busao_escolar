import { Card, Skeleton, Stack } from "@mui/material";

export default function RequestSkeleton() {
  const listCards = [1, 2, 3, 4];
  return listCards.map((index) => (
    <Card key={index} elevation={2} sx={{ padding: 2 }}>
      <Stack spacing={2}>
        <Stack
          spacing={2}
          direction={"row"}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Skeleton animation="wave" variant="rectangular" width="100%" />
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="50%"
            height={30}
          />
        </Stack>
        <Stack
          spacing={2}
          direction={"row"}
          justifyContent="space-between"
          alignItems={"center"}
        >
          <Skeleton animation="wave" variant="rectangular" width="50%" />
          <Skeleton
            animation="wave"
            variant="rectangular"
            width="20%"
            height={30}
          />
        </Stack>
      </Stack>
    </Card>
  ));
}
