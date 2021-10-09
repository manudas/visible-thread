import PropTypes from 'prop-types';
import './styles.scss';

const Popup = ({ data, closePopup, text }) => {
    return data || text
        ? (
            <div
                className="popup__container"
                data-testid="popup__container"
                onClick={() => {
                    closePopup();
                    return false
                }}
            >
                <div
                    className="popup__content bg-light"
                >
                    {
                        data
                            ? data.map(({
                                totalScans,
                                teamName,
                            }, index) => {
                                return <div
                                    key={`${teamName}-${index}`}
                                    onClick={($event) => {
                                        $event.stopPropagation();
                                    }}
                                >
                                    Total scans in week {index}: {totalScans}
                                </div>
                            })
                        : text
                    }
                </div>
            </div>
        )
        : null;
}


Popup.propTypes = {
    closePopup: PropTypes.func,
    data: PropTypes.arrayOf(PropTypes.shape({
        totalScans: PropTypes.number,
        teamName: PropTypes.string
    })),
    text: PropTypes.string,
}

Popup.defaultProps = {
    closePopup: Function.prototype,
    data: null,
    text: null
}

export default Popup;
