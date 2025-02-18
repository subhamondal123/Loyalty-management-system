
import * as React from "react"
import { PropTypes } from 'prop-types';
import Svg, { ClipPath, Path, G } from "react-native-svg"

function LmsCalender({
    strokeColor,
    height,
    width
}) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 51 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <G id="icon/calender">
                <Path
                    id="Vector"
                    d="M4.25 35.625C4.25 38.8125 7.0125 41.25 10.625 41.25H40.375C43.9875 41.25 46.75 38.8125 46.75 35.625V20.625H4.25V35.625ZM40.375 7.5H36.125V5.625C36.125 4.5 35.275 3.75 34 3.75C32.725 3.75 31.875 4.5 31.875 5.625V7.5H19.125V5.625C19.125 4.5 18.275 3.75 17 3.75C15.725 3.75 14.875 4.5 14.875 5.625V7.5H10.625C7.0125 7.5 4.25 9.9375 4.25 13.125V16.875H46.75V13.125C46.75 9.9375 43.9875 7.5 40.375 7.5Z"
                    fill={strokeColor}
                />
            </G>
        </Svg>

    )
}

LmsCalender.defaultProps = {
    strokeColor: "#172834",
    height: 45,
    width: 51
};

LmsCalender.propTypes = {
    strokeColor: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number
};

export default LmsCalender;
