import React from 'react';

import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';

export default function Weather({ weatherData }) {
  const formatNumber = (num) => num.toString().padStart(2, '0');

  const formatDateTime = (dt) => {
    const date = new Date(dt);
    return `${formatNumber(date.getDay())}.${formatNumber(date.getMonth() + 1)} ${date.getHours()}:${formatNumber(date.getMinutes())}`;
  };
  return (
    <Card style={{ minWidth: '200px' }}>
      <Card.Img style={{ height: '100%' }} variant="top" src={weatherData?.weather[0]?.icon ? `/img/${weatherData.weather[0].icon.slice(0, -1)}.svg` : '/img/placeholder.svg'} />
      <Card.Body>
        {weatherData ? (
          <>
            <Card.Title>
              {formatDateTime(weatherData.dt_txt)}
            </Card.Title>
            <Card.Subtitle>
              {`${weatherData.main.temp}°C - ${weatherData.weather[0].main}`}
            </Card.Subtitle>
          </>
        ) : (
          <>
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as={Card.Subtitle} animation="glow">
              <Placeholder xs={7} />
            </Placeholder>
          </>
        )}
      </Card.Body>
    </Card>
  );
}