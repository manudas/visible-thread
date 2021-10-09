import React from 'react';
import {
    fireEvent,
    render,
} from '@testing-library/react';
import Switch from '..';

describe('Switch test suite', () => {

    let handler;
    let renderer;

    beforeEach(() => {
        handler = jest.fn();
        renderer = render(
            <Switch
                checked
                onChange={handler}
            />
        );
    });

    it('should render <Switch />', () => {
        const { container } = renderer;
        expect(container).toMatchSnapshot();
    });

    it('should call onChange function', async () => {

        const { getByTestId } = renderer;
        const container = getByTestId('toggle-switch');
        fireEvent.click(container);

        expect(handler).toHaveBeenCalledTimes(1);
    });
});
