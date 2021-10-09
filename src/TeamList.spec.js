import {
    render,
    fireEvent,
    waitFor
} from '@testing-library/react';

import { Provider } from 'react-redux'

import TeamList from './TeamList';

import store from './store/initialStore';
import { act } from 'react-dom/test-utils';

const ReduxProvider = ({ children, reduxStore }) => (
    <Provider store={reduxStore}>{children}</Provider>
);

describe('Test suite for TeamList', () => {

    // jest.useFakeTimers();

    let renderer;

    const sleep = (ms) => {
        return new Promise(resolveFn => setTimeout(resolveFn, ms));
    }

    beforeEach(() => {
        renderer = render(
                <ReduxProvider reduxStore={store}>
                <TeamList />
            </ReduxProvider>
        );
    });

    afterEach(() => {
        jest.restoreAllMocks(); // clears mocked implementations
        jest.clearAllMocks();
    });


    it('should render and be in the document', () => {
        const { container } = renderer;
        expect(container).toMatchSnapshot();
    });

    it('should search for months and weeks scans', async () => {
        const endpointSpyFunc = jest.spyOn(window, 'fetch').mockImplementation(async () => {
            return {
                ok: true,
                json: async () => [],
            };
        });

        const {
            getAllByTestId,
            getByTestId,
        } = renderer;

        // we have two, one for the months / weeks and another to add a new team
        const input = getAllByTestId('debouncedInput');

        await act(async() => {
            fireEvent.change(
                input[0], // input to select the number of months / weeks
                {
                    target:
                        {
                            value: "12"
                        }
                }
            )
            // debounceTimeout is 500
            // let's let the function to be run
            await sleep(600);
        });

        await waitFor(() => {
            expect(endpointSpyFunc).toHaveBeenCalledTimes(1); // called for months
        });
        // expect(endpointSpyFunc).ToHaveBeenCalledTimes(1); // called for months
        expect(endpointSpyFunc).toHaveBeenCalledWith('http://stubber.test.visiblethread.com/scans/monthly/12');

        const _switch = getByTestId('toggle-switch');
        fireEvent.click(_switch);

        await waitFor(() => {
            expect(endpointSpyFunc).toHaveBeenCalledTimes(2); // 2nd call is for weeks
        });

        expect(endpointSpyFunc).toHaveBeenCalledWith('http://stubber.test.visiblethread.com/scans/weekly/12');
    });

    it('cannot add team if team exists', async () => {
        const endpointSpyFunc = jest.spyOn(window, 'fetch').mockImplementation(async () => {
            return {
                ok: true,
                text: async () => "false",
            };
        });

        const {
            container,
            getAllByTestId,
            getByTestId,
            getByText,
        } = renderer;

        // we have two, one for the months / weeks and another to add a new team
        const input = getAllByTestId('debouncedInput');

        await act(async() => {
            fireEvent.change(
                input[1], // input to type the new team name
                {
                    target:
                        {
                            value: "Team 1"
                        }
                }
            )
            // debounceTimeout is 500
            // let's let the function to be run
            await sleep(600);
        });

        const button = getByText(/Click to create/);

        fireEvent.click(button);

        await waitFor(() => {
            expect(getByTestId('popup__container')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(getByText(/Team wasn't added as it actually exists one team with the same name/)).toBeInTheDocument();
        });

        expect(endpointSpyFunc).toHaveBeenCalled();
        expect(container).toMatchSnapshot();
    });

    it('Add a team if does not exists', async () => {
        const endpointSpyFunc = jest.spyOn(window, 'fetch').mockImplementation(async () => {
            return {
                ok: true,
                text: async () => "true",
            };
        });

        const {
            container,
            getAllByTestId,
            getByTestId,
            getByText,
        } = renderer;

        // we have two, one for the months / weeks and another to add a new team
        const input = getAllByTestId('debouncedInput');

        await act(async() => {
            fireEvent.change(
                input[1], // input to type the new team name
                {
                    target:
                        {
                            value: "Team 100"
                        }
                }
            )
            // debounceTimeout is 500
            // let's let the function to be run
            await sleep(600);
        });

        const button = getByText(/Click to create/);

        fireEvent.click(button);

        await waitFor(() => {
            expect(getByTestId('popup__container')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(getByText(/Team added successfuly/)).toBeInTheDocument();
        });

        expect(endpointSpyFunc).toHaveBeenCalled();
        expect(container).toMatchSnapshot();
    });
});
