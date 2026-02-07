const exchangeRates = {
  INR: 1,
  USD: 83,
  EUR: 90,
};

const convertToINR = (amount, currency) => {
  const rate = exchangeRates[currency] || 1;
  return amount * rate;
};

module.exports = {
  convertToINR,
  exchangeRates,
};
