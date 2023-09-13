import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import { enableFetchMocks } from 'jest-fetch-mock';

jest.mock('use-holderjs');
jest.spyOn(window, 'alert').mockImplementation(() => {});
enableFetchMocks();
