import React from 'react';
import {
    fireEvent,
    render,
} from '@testing-library/react';
import DebouncedInput from '..';

describe('DebouncedInput test suite', () => {

    let handler;
    let renderer;

    // long-runing test
    jest.setTimeout(10000); // 10 secs

    beforeEach(() => {
        handler = jest.fn();
        renderer = render(
            <DebouncedInput
                onChangeHandler={handler}
            />
        );
    });

    it('should render <DebouncedInput />', () => {
        const { container } = renderer;
        expect(container).toMatchSnapshot();
    });

    it('should change input value and should be debounced', async () => {
        const sleep = (ms) => {
            return new Promise(resolveFn => setTimeout(resolveFn, ms));
        }

        const { getByTestId } = renderer;
        const input = getByTestId('debouncedInput');

        // default value is reactjs, which is 7 chars long
        const defaultValue = 'reactjs';
        for (let index = 0; index < defaultValue.length; index++) {
            // lets simulate we are deleting the content of the input
            fireEvent.change(
                input,
                {
                    target:
                        {
                            value: defaultValue.substring(0, (defaultValue.length - 1) - index)
                        }
                }
            );
        }

        const longSubredditName = 'UNBGBBIIVCHIDCTIICBG';
        const timeBeetweenKeystrokes = 200; // ms
        for (let index = 0; index < longSubredditName.length; index++) {

            /* lets simulate we are typing a long
             * subreddit name with a delay of 220
             * milliseconds between each key stroke
             */
            fireEvent.change(
                input,
                {
                    target:
                        {
                            value: longSubredditName.substring(0, index + 1)
                        }
                }
            );
            // debounceTimeout is 500
            await sleep(timeBeetweenKeystrokes);
        }

        // the final result should be the long subreddit name
        expect(input.value).toBe(longSubredditName);

        // debounceTimeout is 500
        // let's let the function to be run
        await sleep(600);
        // as it's debounced, we should only have called it once
        expect(handler).toHaveBeenCalledTimes(1);
    });
});
