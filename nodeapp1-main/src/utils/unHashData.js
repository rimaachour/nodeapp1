//unHash a string of data and return the original data
const bcrypt = require("bcrypt");

const verifyHashedData = async (data, hashedData) => {
  try {
    comparedData = await bcrypt.compare(data, hashedData);
    console.log(comparedData);
    return comparedData;
  } catch (error) {
    throw error;
  }
};

module.exports = verifyHashedData;
