import React from 'react';
import {
    fireEvent,
    render,
    waitFor,
} from '@testing-library/react';

import { Provider } from 'react-redux'
import store from '../../../store/initialStore';

import DataTable from '..';
import monthData from '../../../__mockedData__/teams-month.json';
import weekData from '../../../__mockedData__/teams-week.json';
import monthBreakdownData from '../../../__mockedData__/teams-month-week-breakdown.json';
import { FETCH_TEAMS_SCANS } from '../../../store/action-creators';

const ReduxProvider = ({ children, reduxStore }) => (
    <Provider store={reduxStore}>{children}</Provider>
);

describe('DataTable test suite', () => {

    it('should render emtpy <DataTable />', () => {
        const renderer = render(
            <ReduxProvider reduxStore={store}>
                <DataTable />
            </ReduxProvider>
        );
        const { container } = renderer;
        expect(container).toMatchSnapshot();
    });

    it('should render <DataTable /> with monthly scans', async () => {
        jest.spyOn(window, 'fetch').mockImplementation(async () => {
            return {
                ok: true,
                json: async () => monthData,
            };
        });
        store.dispatch(FETCH_TEAMS_SCANS(12, 'months'));
        const renderer = render(
            <ReduxProvider reduxStore={store}>
                <DataTable />
            </ReduxProvider>
        );
        const {
            container,
            getByTestId,
        } = renderer;

        // wait till the table is filled in with the data in the store
        await waitFor(() => {
            expect(getByTestId('breakdown-results-table')).toBeInTheDocument();
        });
        expect(container).toMatchSnapshot();
    });

    it('should render <DataTable /> with weekly scans', async () => {
        jest.spyOn(window, 'fetch').mockImplementation(async () => {
            return {
                ok: true,
                json: async () => weekData,
            };
        });
        store.dispatch(FETCH_TEAMS_SCANS(12, 'weeks'));
        const renderer = render(
            <ReduxProvider reduxStore={store}>
                <DataTable />
            </ReduxProvider>
        );
        const {
            container,
            getByTestId,
        } = renderer;

        // wait till the table is filled in with the data in the store
        await waitFor(() => {
            expect(getByTestId('breakdown-results-table')).toBeInTheDocument();
        });
        expect(container).toMatchSnapshot();
    });

    it('should render weekly breakdown data in <DataTable /> for monthly scans', async() => {
        jest.spyOn(window, 'fetch').mockImplementation(async () => {
            return {
                ok: true,
                json: async () => monthData,
            };
        });
        store.dispatch(FETCH_TEAMS_SCANS(12, 'months'));

        const renderer = render(
            <ReduxProvider reduxStore={store}>
                <DataTable />
            </ReduxProvider>
        );

        const {
            getByTestId,
            container
        } = renderer;


        // wait till the table is filled in with the data in the store
        await waitFor(() => {
            expect(getByTestId('breakdown-results-table')).toBeInTheDocument();
        });
        const endpointSpyFunc = jest.spyOn(window, 'fetch').mockImplementation(async () => {
            return {
                ok: true,
                json: async () => monthBreakdownData,
            };
        });

        const table = getByTestId('breakdown-results-table');

        const cells = table.getElementsByTagName('td');
        fireEvent.click(
            cells[0], // first cell
        );

        expect(endpointSpyFunc).toHaveBeenCalled();

        await waitFor(() => {
            expect(getByTestId('popup__container')).toBeInTheDocument();
        });

        expect(container).toMatchSnapshot();
    });
});
