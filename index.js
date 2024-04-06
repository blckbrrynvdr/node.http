#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const http = require("http");
const {API_KEY, WEATHER_API_PATH} = require('./config.js');

const argv = yargs(hideBin(process.argv))
	.option('city', {
		alias: 'c',
		type: "string",
		description: "Название города"
	})
	.argv;

const city = argv._[0] || argv?.city;

if (!API_KEY) {
	console.error('Не установлен API ключ');
	return;
}

if (!city) {
	console.error('Не указан город');
	return;
}

const url = `${WEATHER_API_PATH}/current.json?key=${API_KEY}&q=${city}`;

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
		console.log(
			`Данные о погоде в ${parseData.location.name} (${parseData.location.country}):\n`+
			`Температура(°C): ${parseData.current.temp_c} (ощущается как ${parseData.current.feelslike_c}),\n`+
			`Ветер(м/с): ${parseData.current.wind_kph}.\n`
		);
	});
}).on('error', (err) => {
	console.error(err)
});
