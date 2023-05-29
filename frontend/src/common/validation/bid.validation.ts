import * as Yup from "yup";
import { toCurrency } from "../../utils/currency.utils";

const makeBidSchema = (last_price: number)=> Yup.object().shape({
  bid_id: Yup.string().required("Enter Bid ID"),
  bid_amount: Yup.number().min(last_price + 0.01, `Bid amount must be greater than $${toCurrency(last_price)}`).required("Enter item description"),
});

export default makeBidSchema;
