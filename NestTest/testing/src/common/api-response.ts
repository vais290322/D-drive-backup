export function apiResponse(
  success: boolean,
  statusCode: number,
  message: string,
  data: any = null,
) {
  return {
    success,
    statusCode,
    message,
    data,
  };
}