const HandleError = (error: any): { status: number; message: string } => {
  const errorSummary = {
    status: 0,
    message: "",
  };
  if (error.response) {
    console.error(error.response.data.message);
    errorSummary.message = error.response.data?.message || "error undefined";
    errorSummary.status = error.response.data?.status || 0;
  } else if (error.request) {
    console.error(`can't connect to server`);
    errorSummary.message = `can't connect to server`;
  } else {
    console.error();
    console.error(error);
    errorSummary.message = error;
  }
  return errorSummary;
};

export { HandleError };
export default HandleError;
