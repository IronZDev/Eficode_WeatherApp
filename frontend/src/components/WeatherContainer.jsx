import React, { useEffect, useState } from 'react';

import CardGroup from 'react-bootstrap/CardGroup';
import WeatherCard from './WeatherCard';

const baseURL = process.env.ENDPOINT;
const SAMPLE_LATITUDE = 51.7;
const SAMPLE_LONGITUDE = 19.4;

export default function WeatherContainer() {
  const [weatherDataRes, setWeatherDataRes] = useState();

  async function getWeatherFromApi(pos) {
    try {
      const response = await fetch(`${baseURL}/weather?latitude=${pos.lat}&longitude=${pos.lon}`);
      return response.json();
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  function getCurrentLocation({ signal }) {
    return new Promise((resolve, reject) => {
      const abortHandler = () => {
        reject(new Error('Aborted'));
      };
      const successHandler = (pos) => {
        signal?.removeEventListener('abort', abortHandler);
        resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      };
      const errorHandler = () => {
        // eslint-disable-next-line no-undef
        alert('Can\'t obtain current position. Using sample one.');
        signal?.removeEventListener('abort', abortHandler);
        resolve({ lat: SAMPLE_LATITUDE, lon: SAMPLE_LONGITUDE });
      };
      // eslint-disable-next-line no-undef
      if (navigator.geolocation) {
        // eslint-disable-next-line no-undef
        navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
      } else {
        console.log('Geolocation not supported');
        errorHandler();
      }
      signal?.addEventListener('abort', abortHandler);
    });
  }

  useEffect(() => {
    // We have to Abort the execution if the component gets unmounted to prevent memory leaks
    const abortController = new AbortController();

    getCurrentLocation(abortController)
      .then((pos) => getWeatherFromApi(pos))
      .then((data) => setWeatherDataRes(data))
      .catch((err) => console.error(err.message));
    return () => { abortController.abort(); };
  }, []);

  const heading = weatherDataRes?.city ? `Weather for ${weatherDataRes.city?.name}, ${weatherDataRes.city?.country}` : 'Loading forecast...';
  return (
    <>
      <h1 className="text-center m-3">
        {heading}
      </h1>
      <CardGroup style={{ overflowX: 'scroll', flexFlow: 'nowrap' }}>
        {weatherDataRes?.list?.length
          ? weatherDataRes.list.map((weatherData) => <WeatherCard key={weatherData.dt} weatherData={weatherData} />)
        // eslint-disable-next-line react/no-array-index-key
          : Array(5).map((_, i) => <WeatherCard key={i} weatherData={null} />)}
      </CardGroup>
    </>
  );
}
