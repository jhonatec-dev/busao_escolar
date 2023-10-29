const statusList = {
  SUCCESS: 200,
  CREATED: 201,
  DELETED: 204,
  INVALID: 400,
  NOT_FOUND: 404,
  ERROR: 500,
};

export const mapStatusHTTP = (status: string) =>
  statusList[status as keyof typeof statusList] || 500;
