import { Card, Skeleton, Stack } from "@mui/material";

interface StudentSkeletonProps {
  single?: boolean;
}

export default function StudentSkeleton({
  single = false,
}: StudentSkeletonProps) {
  const listCards = single ? [1] : [1, 2, 3];

  return (
    <Stack spacing={2}>
      {listCards.map((index) => (
        <Card key={index} elevation={2} sx={{ padding: 2 }}>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems={"center"}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="80%"
                height={25}
              />
              <Skeleton
                animation="wave"
                variant="circular"
                width={35}
                height={35}
              />
            </Stack>
            <Skeleton animation="wave" variant="rectangular" width="50%" />
            <Skeleton animation="wave" variant="rectangular" width="50%" />
            <Skeleton
              animation="wave"
              variant="rectangular"
              width="80%"
              height={40}
            />
          </Stack>
        </Card>
      ))}
    </Stack>
  );
}
