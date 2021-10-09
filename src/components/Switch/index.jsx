import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

const Switch = ({
    name,
    checked,
    onChange,
    optionLabels,
}) => {
    return (
        <div className="toggle-switch m-5"
            data-testid="toggle-switch"
            onClick={e => onChange(e)}
        >
            <input
                type="checkbox"
                className="toggle-switch-checkbox"
                name={name}
                id={name}
                checked={checked}
                readOnly
                onClick={(e) => e.stopPropagation()}
            />
            <label className="toggle-switch-label" htmlFor={name}>
                <span className="toggle-switch-inner"
                    data-yes={optionLabels[0]}
                    data-no={optionLabels[1]}
                />
                <span className="toggle-switch-switch" />
            </label>
        </div>
    );
}

Switch.propTypes = {
    checked: PropTypes.bool.isRequired,
    name: PropTypes.string,
    onChange: PropTypes.func,
    optionLabels: PropTypes.arrayOf(PropTypes.string),
}

Switch.defaultProps = {
    name: "switch",
    onChange: Function.prototype,
    optionLabels: ["Yes", "No"],
}

export default Switch;
