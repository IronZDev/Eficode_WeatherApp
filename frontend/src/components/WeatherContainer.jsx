import React, { useEffect, useState } from 'react';

import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { Button } from 'react-bootstrap';
import WeatherCard from './WeatherCard';

const baseURL = process.env.ENDPOINT;
const SAMPLE_LATITUDE = 51.7;
const SAMPLE_LONGITUDE = 19.4;

export default function WeatherContainer() {
  const [weatherDataRes, setWeatherDataRes] = useState();
  const [isLoading, setLoading] = useState(false);

  async function getWeatherFromApi(pos) {
    try {
      const response = await fetch(`${baseURL}/weather?latitude=${pos.lat}&longitude=${pos.lon}`);
      return response.json();
    } catch (error) {
      // eslint-disable-next-line no-undef
      alert(error.message);
      console.error(error);
    }
    return null;
  }

  function getCurrentLocation(abortController) {
    return new Promise((resolve, reject) => {
      const abortHandler = () => {
        reject(new Error('Aborted'));
      };
      const successHandler = (pos) => {
        abortController?.signal?.removeEventListener('abort', abortHandler);
        resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      };
      const errorHandler = () => {
        // eslint-disable-next-line no-undef
        alert('Can\'t obtain current position. Using sample one.');
        abortController?.signal?.removeEventListener('abort', abortHandler);
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
      abortController?.signal?.addEventListener('abort', abortHandler);
    });
  }

  const refreshData = (abortController = null) => {
    setLoading(true);
    getCurrentLocation(abortController)
      .then((pos) => getWeatherFromApi(pos))
      .then((data) => { if (data) setWeatherDataRes(data); })
      .catch((err) => console.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // We have to Abort the execution if the component gets unmounted to prevent memory leaks
    const abortController = new AbortController();
    refreshData(abortController);
    return () => { abortController.abort(); };
  }, []);

  const handleClick = () => refreshData();

  const heading = weatherDataRes?.city ? `Weather for ${weatherDataRes.city?.name}, ${weatherDataRes.city?.country}` : 'Loading forecast...';
  return (
    <>
      <Card className="custom-card">
        <Card.Title className="mt-3 mb-0">
          <h1 style={{ textAlign: 'center' }}>{heading}</h1>
        </Card.Title>
        <Card.Body>
          <CardGroup style={{ overflowX: 'scroll', flexFlow: 'nowrap' }}>
            {weatherDataRes?.list?.length
              ? weatherDataRes.list.map((weatherData) => <WeatherCard key={weatherData.dt} weatherData={weatherData} />)
            // eslint-disable-next-line react/no-array-index-key
              : [...Array(5)].map((_, i) => <WeatherCard key={i} weatherData={null} />)}
          </CardGroup>
        </Card.Body>
        <Card.Footer style={{ textAlign: 'center' }}>
          <Button
            variant="primary"
            disabled={isLoading}
            onClick={!isLoading ? handleClick : null}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
}
