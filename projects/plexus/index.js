const axios = require("axios");

const CHAIN = {
  1: "ethereum",
  56: "binance",
  137: "polygon",
  250: "fantom",
  2222: "kava",
  42161: "arbitrum",
  43114: "avax",
  10: "optimism",
  8217: "klaytn",
  1313161554: "aurora",
};

const getFee = async (chainId, formattedDate) => {
  const { data } = await axios.get(
    `https://api.plexus.app/v1/dashboard/fee?date=${formattedDate}`
  );
  return data.data[chainId];
};

const getTradingStatus = async (chainId, formattedDate) => {
  const { data } = await axios.get(
    `https://api.plexus.app/v1/dashboard/status?date=${formattedDate}`
  );
  return data.data[chainId];
};

const timeStampToDate = (timestamp) => {
  const date = new Date(timestamp);

  const year = date.getUTCFullYear();
  const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
  const day = ("0" + date.getUTCDate()).slice(-2);

  return `${year}-${month}-${day}`;
};

module.exports = Object.entries(CHAIN).reduce(
  (result, [chainId, chainName]) => {
    result[chainName] = {
      fetch: async (timestamp) => {
        const formattedDate = timeStampToDate(timestamp);
        const [fee, status] = await Promise.all([
          getFee(chainId, formattedDate),
          getTradingStatus(chainId, formattedDate),
        ]);

        return { fee, status };
      },
    };
    return result;
  },
  {}
);
