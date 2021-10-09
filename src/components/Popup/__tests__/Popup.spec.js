import React from 'react';
import {
    fireEvent,
    render,
} from '@testing-library/react';
import Popup from '..';

describe('Popup test suite', () => {

    it('should render <Popup /> with data', () => {
        let handler = jest.fn();
        let renderer = render(
            <Popup
                data={[
                    {
                        totalScans: 5,
                        teamName: "Team 1"
                    },
                    {
                        totalScans: 6,
                        teamName: "Team 2"
                    },
                ]}
                closePopup={handler}
            />
        );
        const { container } = renderer;
        expect(container).toMatchSnapshot();
    });

    it('should render <Popup /> with text', () => {
        let handler = jest.fn();
        let renderer = render(
            <Popup
                text="Test message"
                closePopup={handler}
            />
        );
        const { container } = renderer;
        expect(container).toMatchSnapshot();
    });

    it('should call close function', async () => {

        let handler = jest.fn();
        let renderer = render(
            <Popup
                text="Test message"
                closePopup={handler}
            />
        );

        const { getByTestId } = renderer;
        const container = getByTestId('popup__container');
        fireEvent.click(container);

        expect(handler).toHaveBeenCalledTimes(1);
    });
});
