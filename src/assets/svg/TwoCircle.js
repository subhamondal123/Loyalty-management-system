import * as React from "react"
import { PropTypes } from 'prop-types';
import Svg, { ClipPath, Path, G } from "react-native-svg"

function TwoCircle({
    strokeColor,
    height,
    width,
    children
}) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 54 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M27 28.15C29.65 30.55 33.15 32 37 32C45.275 32 52 25.275 52 17C52 8.725 45.275 2 37 2C33.15 2 29.65 3.45 27 5.85M27 28.15C30.075 25.425 32 21.425 32 17C32 12.575 30.075 8.575 27 5.85M27 28.15C24.35 30.55 20.85 32 17 32C8.725 32 2 25.275 2 17C2 8.725 8.725 2 17 2C20.85 2 24.35 3.45 27 5.85"
                stroke={strokeColor}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

TwoCircle.defaultProps = {
    strokeColor: "#FFFFFF",
    height: 34,
    width: 54,
    children: null
};

TwoCircle.propTypes = {
    strokeColor: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    children: PropTypes.node
};

export default TwoCircle;
