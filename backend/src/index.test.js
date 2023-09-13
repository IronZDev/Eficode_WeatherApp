const request = require('supertest');

jest.setTimeout(60000);

const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetModules()
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  process.env = OLD_ENV; // Restore old environment
});

describe('/api/weather unit tests', () => {
    it('Should get data from OpenWeather', async () => {
        jest.unmock('node-fetch');
        jest.resetModules()
        const unMockedApp = require('./index');
        const response = await request(unMockedApp.callback()).get('/api/weather?dataPointsToFetch=1');
        expect(response.status).toBe(200);
        expect(response.body.cnt).toBe(1);
    });
    
    it('It should return correct data', async () => {
        jest.mock('node-fetch');
        jest.resetModules()
        const fetch = require('node-fetch');
        const { Response } = jest.requireActual('node-fetch');
        const app = require('./index');
        fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify({responded: true}))));
        const response = await request(app.callback()).get('/api/weather?latitude=49&longitude=10&dataPointsToFetch=1');

        expect(response.status).toBe(200);
        expect(response.body.responded).toBe(true);
        expect(fetch).toHaveBeenCalledWith(`http://api.openweathermap.org/data/2.5/forecast?lat=49&lon=10&units=metric&cnt=1&appid=${OLD_ENV.APPID}`)
    });

    it('It should handle API outage', async () => {
        jest.mock('node-fetch');
        jest.resetModules()
        const fetch = require('node-fetch');
        const app = require('./index');
        fetch.mockRejectedValue(new Error("No response"));
        const response = await request(app.callback()).get('/api/weather?latitude=49&longitude=10&dataPointsToFetch=1');
        expect(response.status).toBe(503);
        expect(response.body.err).toBe("No response");
        expect(fetch).toHaveBeenCalledWith(`http://api.openweathermap.org/data/2.5/forecast?lat=49&lon=10&units=metric&cnt=1&appid=${OLD_ENV.APPID}`);
    });

    it('It should handle empty response', async () => {
        jest.mock('node-fetch');
        jest.resetModules()
        const fetch = require('node-fetch');
        const { Response } = jest.requireActual('node-fetch');
        const app = require('./index');
        fetch.mockReturnValue(Promise.resolve(new Response()));
        const response = await request(app.callback()).get('/api/weather?latitude=49&longitude=10&dataPointsToFetch=1');
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({});
        expect(fetch).toHaveBeenCalledWith(`http://api.openweathermap.org/data/2.5/forecast?lat=49&lon=10&units=metric&cnt=1&appid=${OLD_ENV.APPID}`)
    });
});
describe('Test general server', () => {    
    it('Should start listening', async () => {
        process.env.NODE_ENV = "dev";
        jest.mock('./index', () => {
            const original = jest.requireActual('./index');
            return {...original, listen: jest.fn()}
        });
        jest.resetModules();
        const app = require('./index');
        app.listen(process.env.PORT || 9000);
        expect(app.listen.mock.calls.length).toBe(1);
        expect(app.listen.mock.calls[0][0]).toBe(process.env.PORT || 9000);
    });
});