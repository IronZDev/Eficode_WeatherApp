import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import WeatherCard from './WeatherCard';
import getWeatherMockResponse from '../mocks/getWeatherResponse.mock.json';

const weatherData = getWeatherMockResponse.list[0];

describe('Weather Card', () => {
  it('should display placeholders if no data', async () => {
    await act(async () => render(<WeatherCard weatherData={null} />));
    const card = await screen.findByTestId('weather-card');
    const img = await screen.findByTestId('weather-card-img');
    const titlePlaceholder = await screen.findByTestId('weather-card-title-placeholder');
    const subtitlePlaceholder = await screen.findByTestId('weather-card-subtitle-placeholder');
    expect(card).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'holder.js/200x200?auto=yes&text=Loading');
    expect(titlePlaceholder).toBeInTheDocument();
    expect(subtitlePlaceholder).toBeInTheDocument();
  });

  it('should display weather data', async () => {
    await act(async () => render(<WeatherCard weatherData={weatherData} />));
    const card = await screen.findByTestId('weather-card');
    const img = await screen.findByTestId('weather-card-img');
    const title = await screen.getByText('03.09 18:00');
    const subtitle = await screen.getByText('26.1°C - Rain');
    const titlePlaceholder = await screen.queryByTestId('weather-card-title-placeholder');
    const subtitlePlaceholder = await screen.queryByTestId('weather-card-subtitle-placeholder');
    expect(card).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/img/10.svg');
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    expect(titlePlaceholder).not.toBeInTheDocument();
    expect(subtitlePlaceholder).not.toBeInTheDocument();
  });
});
