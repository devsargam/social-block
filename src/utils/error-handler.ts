export const sendErrorResponse = (sendResponse: Function, error: unknown) => {
  sendResponse({
    success: false,
    error: error instanceof Error ? error.message : String(error),
  });
};
