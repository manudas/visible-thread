import React, {
    useState,
    useMemo,
} from 'react';

import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';

import {
    debounceTimeout,
} from '../../constants';

import './styles.scss';

const DebouncedInput = ({
    onChangeHandler,
    label,
}) => {
    const [ inputValue, setInputValue ] = useState('');

    /*
     * We are going to use useMemo
     * here in order to not redeclare
     * this handler everytime the
     * component is rendered. Otherwise
     * the debounce effect would be lost
     */
    const debouncedHandler = useMemo( () => debounce(
        (passedReddit) => {
            onChangeHandler(passedReddit);
        },
        debounceTimeout,
        {
            'leading': false,
            'trailing': true,
        }), [onChangeHandler]);

    /**
     * Internal onChange handler.
     * Will invoke the external fn
     * passed down in a given time,
     * as is supposed to be time
     * debounced
     *
     * @param {strin} param0 the string
     * value of the input that has changed
     *
     */
    const onInputChangeHandler = ({
        target: {
            value
        }
    }) => {
        setInputValue(value);
        debouncedHandler(value);
    };

    return (
        <label
            className="debounced-input__label"
            htmlFor="subreddit">
                {label}
                <input
                    data-testid="debouncedInput"
                    className="debounced-input__input"
                    onChange={onInputChangeHandler}
                    id="subreddit"
                    value={inputValue}
                />
        </label>
    );
};

DebouncedInput.propTypes = {
    onChangeHandler: PropTypes.func,
}

DebouncedInput.defaultProps = {
    onChangeHandler: Function.prototype,
}

export default DebouncedInput;
