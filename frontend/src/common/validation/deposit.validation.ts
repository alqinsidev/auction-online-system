import * as Yup from 'yup';

const storeDepositSchema = Yup.object().shape({
  store_amount: Yup.number()
    .min(1,'Minimum deposit is 1 USD')
    .required('Enter the deposit amount'),
});

export default storeDepositSchema;
