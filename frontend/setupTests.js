import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import { enableFetchMocks } from 'jest-fetch-mock';

// HolderJS does not work in JestDOM
jest.mock('use-holderjs', () => ({ useHolderjs: () => jest.fn() }));
jest.spyOn(window, 'alert').mockImplementation(() => {});
enableFetchMocks();