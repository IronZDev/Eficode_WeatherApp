const debug = require('debug')('weathermap');
// Read env vars from .env file in dev mode
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: "./.env.dev"});
}

const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');

const appId = process.env.APPID || '';
const mapURI =
  process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors());

const fetchWeather = async (latitude, longitude, dataPointsToFetch) => {
  const endpoint = `${mapURI}/forecast?lat=${latitude}&lon=${longitude}&units=metric&cnt=${dataPointsToFetch}&appid=${appId}`;
  const response = await fetch(endpoint);
  return response?.body ? response.json() : {};
};

router.get('/api/weather', async (ctx) => {
  const queryParams = ctx.request.query;
  const latitude = queryParams?.latitude || 51.7;
  const longitude = queryParams?.longitude || 19.4;
  const dataPointsToFetch = queryParams?.dataPointsToFetch || 40; // In free plan of OpenWeatherMap the highest value 40 (5 days, every 3 hours)
  try {
    const weatherData = await fetchWeather(latitude, longitude, dataPointsToFetch);
    ctx.type = 'application/json; charset=utf-8';
    ctx.body = weatherData;
  } catch (err) {
    ctx.status = 503;
    ctx.type = 'application/json; charset=utf-8';
    ctx.body = {err: err.message};
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

if (process.env.NODE_ENV !== "test") {
  app.listen(port);
  console.log(`App listening on port ${port}`);
}


module.exports = app;