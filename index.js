#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const http = require("http");

require("dotenv").config();

const argv = yargs(hideBin(process.argv))
	.option('city', {
		alias: 'c',
		type: "string",
		description: "Название города"
	})
	.argv;

const city = argv._[0] || argv?.city;

const apiKey = process.env.API_KEY;

if (!apiKey) {
	console.error('Api key is not installed');
	return;
}

const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

http.get(url, (res) => {
	const {statusCode} = res;

	if (statusCode !== 200) {
		console.log('error, statusCode:', statusCode)
		return
	}

	res.setEncoding('utf8');
	let rowData = '';
	res.on('data', (chunk) => rowData += chunk)
	res.on('end', () => {
		let parseData = JSON.parse(rowData);

		console.log(`
Данные о погоде в ${parseData.location.name} (${parseData.location.country}):
Температура(°C): ${parseData.current.temp_c} (ощущается как ${parseData.current.feelslike_c}),
Ветер(м/с): ${parseData.current.wind_kph}.`);
	})
}).on('error', (err) => {
	console.error(err)
});
