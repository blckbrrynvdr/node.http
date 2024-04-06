require("dotenv").config();

const API_KEY = process.env.API_KEY;
const WEATHER_API_PATH = 'http://api.weatherapi.com/v1';

module.exports = {
	API_KEY,
	WEATHER_API_PATH
};