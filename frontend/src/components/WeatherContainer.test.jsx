import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import WeatherContainer from './WeatherContainer';
import getWeatherMockResponse from '../mocks/getWeatherResponse.mock.json';

describe('Weather Container', () => {
  it('should display the Loading heading if no response', async () => {
    await act(async () => render(<WeatherContainer />));
    const heading = screen.getByText(/Loading forecast\.\.\./i);
    expect(heading).toBeInTheDocument();
  });

  it('should display placeholders if no response', async () => {
    await act(async () => render(<WeatherContainer />));
    const loadingPlaceholders = await screen.findAllByTestId('weather-card');
    expect(loadingPlaceholders.length).toBe(5);
  });

  it('should display city if response received', async () => {
    fetchMock.mockOnce(JSON.stringify(getWeatherMockResponse));
    jest.resetModules();
    await act(async () => render(<WeatherContainer />));
    const heading = screen.getByText(/Weather for Zubardź/i);
    expect(heading).toBeInTheDocument();
  });

  it('should display weather cards for all data received', async () => {
    fetchMock.mockOnce(JSON.stringify(getWeatherMockResponse));
    jest.resetModules();
    await act(async () => render(<WeatherContainer />));
    const weatherCards = await screen.findAllByTestId('weather-card');
    expect(weatherCards.length).toBe(getWeatherMockResponse.list.length);
  });

  it('should send current position', async () => {
    fetchMock.mockOnce(JSON.stringify(getWeatherMockResponse));
    const mockGeolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success) => Promise.resolve(
        success({
          coords: {
            latitude: 10,
            longitude: 10,
          },
        }),
      )),
    };
    // eslint-disable-next-line no-undef
    navigator.geolocation = mockGeolocation;
    jest.resetModules();
    await act(async () => render(<WeatherContainer />));
    // eslint-disable-next-line no-undef
    expect(navigator.geolocation.getCurrentPosition.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toContain('latitude=10&longitude=10');
  });

  it('should handle fetch error', async () => {
    fetchMock.mockRejectOnce(new Error('No response'));

    jest.resetModules();
    await act(async () => render(<WeatherContainer />));
    expect(window.alert.mock.calls.length).toBe(1);
    expect(window.alert.mock.calls[0][0]).toBe('No response');
  });
});
