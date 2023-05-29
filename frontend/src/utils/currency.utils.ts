const toCurrency = (input: number | string) =>
  `${input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export { toCurrency };
