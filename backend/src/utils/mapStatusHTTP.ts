const statusList = {
  SUCCESS: 200,
  CREATED: 201,
  DELETED: 204,
  UPDATED: 200,
  INVALID: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  ERROR: 500
}

export const mapStatusHTTP = (status: string): number =>
  statusList[status as keyof typeof statusList]
