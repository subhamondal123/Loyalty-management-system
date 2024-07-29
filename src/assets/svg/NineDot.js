import * as React from "react"
import { PropTypes } from 'prop-types';
import Svg, { ClipPath, Path, G } from "react-native-svg"

function NineDot({
    strokeColor,
    height,
    width
}) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                id="Union"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 3C6 4.65685 4.65685 6 3 6C1.34315 6 0 4.65685 0 3C0 1.34315 1.34315 0 3 0C4.65685 0 6 1.34315 6 3ZM6 12C6 13.6569 4.65685 15 3 15C1.34315 15 0 13.6569 0 12C0 10.3431 1.34315 9 3 9C4.65685 9 6 10.3431 6 12ZM3 24C4.65685 24 6 22.6569 6 21C6 19.3431 4.65685 18 3 18C1.34315 18 0 19.3431 0 21C0 22.6569 1.34315 24 3 24ZM15 3C15 4.65685 13.6569 6 12 6C10.3431 6 9 4.65685 9 3C9 1.34315 10.3431 0 12 0C13.6569 0 15 1.34315 15 3ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15ZM15 21C15 22.6569 13.6569 24 12 24C10.3431 24 9 22.6569 9 21C9 19.3431 10.3431 18 12 18C13.6569 18 15 19.3431 15 21ZM21 6C22.6569 6 24 4.65685 24 3C24 1.34315 22.6569 0 21 0C19.3431 0 18 1.34315 18 3C18 4.65685 19.3431 6 21 6ZM24 12C24 13.6569 22.6569 15 21 15C19.3431 15 18 13.6569 18 12C18 10.3431 19.3431 9 21 9C22.6569 9 24 10.3431 24 12ZM21 24C22.6569 24 24 22.6569 24 21C24 19.3431 22.6569 18 21 18C19.3431 18 18 19.3431 18 21C18 22.6569 19.3431 24 21 24Z"
                fill={strokeColor}
            />
        </Svg>
    )
}

NineDot.defaultProps = {
    strokeColor: "#FFFFFF",
    height: 24,
    width: 24
};

NineDot.propTypes = {
    strokeColor: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number
};

export default NineDot;
