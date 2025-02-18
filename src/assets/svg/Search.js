import * as React from "react"
import { PropTypes } from 'prop-types';
import Svg, { ClipPath, Path, G } from "react-native-svg"

function Search({
    strokeColor,
    height,
    width,
    children
}) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 45 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M19.9926 39.9852C31.0342 39.9852 39.9852 31.0342 39.9852 19.9926C39.9852 8.95099 31.0342 0 19.9926 0C8.95099 0 0 8.95099 0 19.9926C0 31.0342 8.95099 39.9852 19.9926 39.9852Z"
                fill="#1F2B4D"
            />
            <Path
                d="M44.3566 37.6109C43.6244 36.2574 42.0711 35.503 39.9853 35.503C38.4099 35.503 37.0563 36.1464 36.2575 37.2559C35.4587 38.3654 35.2812 39.8521 35.7693 41.3388C36.7235 44.2234 38.3877 44.8669 39.2974 44.9778C39.4306 45 39.5637 45 39.719 45C40.6954 45 42.2043 44.5784 43.6688 42.3817C44.8448 40.6731 45.0667 38.9645 44.3566 37.6109Z"
                fill="#1F2B4D"
            />
        </Svg>
    )
}

Search.defaultProps = {
    strokeColor: "#292D32",
    height: 51,
    width: 81,
    children: null
};

Search.propTypes = {
    strokeColor: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    children: PropTypes.node
};

export default Search;
