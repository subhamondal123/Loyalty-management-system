
import * as React from "react"
import { PropTypes } from 'prop-types';
import Svg, { ClipPath, Path, G } from "react-native-svg"

function LmsUser({
    strokeColor,
    height,
    width
}) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 43 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <G id="Frame 1137">
                <Path
                    id="Vector"
                    d="M21.1202 0C13.2602 0 6.87012 6.39004 6.87012 14.2501C6.87012 21.9601 12.9002 28.2002 20.7602 28.4702C21.0002 28.4402 21.2402 28.4402 21.4202 28.4702C21.4802 28.4702 21.5102 28.4702 21.5702 28.4702C21.6002 28.4702 21.6002 28.4702 21.6302 28.4702C29.3102 28.2002 35.3403 21.9601 35.3703 14.2501C35.3703 6.39004 28.9802 0 21.1202 0Z"
                    fill={strokeColor}
                />
                <Path
                    id="Vector_2"
                    d="M36.3602 36.4497C27.9902 30.8696 14.3401 30.8696 5.91003 36.4497C2.10001 38.9997 0 42.4497 0 46.1397C0 49.8298 2.10001 53.2498 5.88003 55.7698C10.0801 58.5898 15.6001 59.9998 21.1201 59.9998C26.6402 59.9998 32.1602 58.5898 36.3602 55.7698C40.1402 53.2198 42.2402 49.7998 42.2402 46.0797C42.2103 42.3897 40.1402 38.9697 36.3602 36.4497Z"
                    fill={strokeColor}
                />
            </G>
        </Svg>

    )
}

LmsUser.defaultProps = {
    strokeColor: "#FFFFFF",
    height: 60,
    width: 43
};

LmsUser.propTypes = {
    strokeColor: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number
};

export default LmsUser;
