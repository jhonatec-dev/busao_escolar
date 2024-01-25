import { DataContext } from "@/context/data.provider";
import { Refresh } from "@mui/icons-material";
import { Card, IconButton, Stack, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import RequestCard from "./RequestCard";
import RequestSkeleton from "./RequestSkeleton";

export default function Requests() {
  const { requests, getRequests, loadingRequests, loadMonthTravels } =
    useContext(DataContext);

  useEffect(() => {
    getRequests();
  }, []);

  const refresh = async () => {
    await getRequests();
    await loadMonthTravels();
  };

  return (
    <>
      <Card className='Card' variant='outlined'>
        <Stack spacing={2}>
          <Stack direction={"row"} justifyContent='space-between'>
            <Typography variant='h6'>Solicitações</Typography>
            <IconButton onClick={refresh}>
              <Refresh />
            </IconButton>
          </Stack>
          {loadingRequests ? (
            <RequestSkeleton />
          ) : (
            <Stack spacing={2}>
              {requests &&
                requests.map((request, index) => (
                  <RequestCard key={index} request={request} />
                ))}
            </Stack>
          )}
        </Stack>
      </Card>
    </>
  );
}
