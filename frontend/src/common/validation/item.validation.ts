import * as Yup from "yup";

const createItemSchema = (options: {label: string, value: number}[])=> Yup.object().shape({
  name: Yup.string().required("Enter item name"),
  description: Yup.string().required("Enter item description"),
  start_price: Yup.number()
    .min(1, "Minimum price is 1 USD")
    .required("Enter the price"),
    time_window: Yup.number()
    .oneOf(options.map(option => option.value), 'time is not available')
    .required(' Choose the time window')
});

export default createItemSchema;
