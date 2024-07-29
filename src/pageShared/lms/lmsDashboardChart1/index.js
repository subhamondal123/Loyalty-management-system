import React, { Component } from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryLegend, VictoryTheme } from 'victory-native'
import { Dimension, ImageName } from '../../../enums'
import { Image } from 'react-native';
import { ForeignObject, G, Rect } from 'react-native-svg';


const tickMainComponent = (props) => (
    // <ForeignObject>
    //     <View style={{ width: 20, height: 20 }}>
    //         <Image source={ImageName.EXPENSE_VISIT_ICON} style={{ width: 20, height: 20 }} />
    //     </View>
    // </ForeignObject>

    <ForeignObject style={{ paddingTop: String(props.xAxisImagesTopPadding) + "px", paddingLeft: String(props.xAxisImagesLeftInitialPadding + (props.xAxisImagesTickSize * props.index)) + "px" }}>
        {
            props.xAxisInformation[props.index] !== undefined ?
                <Image source={ImageName.EXPENSE_VISIT_ICON} style={{ width: 20, height: 20 }} />
                : null
        }
    </ForeignObject>

);
const CustomTick = ({ x, y }) => {
    // return <Rect x={x - 5} y={y} width={10} height={10} />;
    return (
        <View>
            {/* <Text style={{ color: "red" }}>sam</Text> */}
            <Rect x={x - 5} y={y} width={10} height={10} stroke={"red"} >
                {/* <Text style={{ color: "red" }}>sam</Text> */}
            </Rect>
        </View>
    )
};

const chartData = {
    target: [
        { x: "January", y: 5000 },
        { x: "February", y: 10000 },
        { x: "March", y: 8000 },
        { x: "April", y: 12000 },
        { x: "May", y: 15000 },
        { x: "June", y: 18000 }
    ],
    achieved: [
        { x: "January", y: 3000 },
        { x: "February", y: 7000 },
        { x: "March", y: 6000 },
        { x: "April", y: 10000 },
        { x: "May", y: 13000 },
        { x: "June", y: 16000 },
    ]
};


class Index extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }


    customBarWidth = (props) => {
        // const { datum } = props;

        // Customize the borderRadius for bars at the bottom
        // const borderRadius = datum.y === Math.min(this.props.data.map((d) => d.y)) ? 10 : 0;

        // return {
        //     // width: this.props.scale.x.range()[1] / this.props.data.length,
        //     borderRadius: borderRadius,
        // };
    };

    render() {
        return (
            <SafeAreaView style={{ marginHorizontal: 15 }}>

                <VictoryChart theme={VictoryTheme.material}
                    padding={{ left: 80, top: 20, right: 50, bottom: 50 }}
                    height={200}
                // animate={{
                //     duration: 500,
                //     onLoad: { duration: 500 }
                // }}
                >
                    <VictoryAxis
                        // tickComponent={tickMainComponent}
                        style={{
                            grid: { stroke: 'none' }, // to hide the grid
                            axis: { stroke: "transparent" }, // to make the axis invisible
                            ticks: { stroke: "transparent" }, // to hide the line of this particular axis
                            tickLabels: { fill: "#738490", fontSize: 14, fontWeight: 600 },


                        }}
                    // tickLabelComponent={<CustomTick />}

                    />
                    <VictoryAxis
                        tickCount={6} // Adjust the number of ticks according to your preference
                        dependentAxis
                        crossAxis={false}
                        offsetX={45}
                        tickValues={[0, 5000, 10000, 15000, 20000]}
                        tickFormat={(value) => {
                            if (value >= 5000) {
                                return `${value / 1000}K`; // Display in thousands with 'K' suffix
                            }
                            return value;
                        }}
                        style={{
                            grid: { stroke: 'none' },
                            axis: { stroke: "black" }, // to make the axis invisible
                            ticks: { stroke: "black" },
                            tickLabels: { fill: "#738490", fontSize: 14, fontWeight: 600 }, // Make the tick labels invisible
                        }}
                    />
                    {/* <VictoryAxis label="Week"/> */}
                    <VictoryGroup offset={20} colorScale={"qualitative"} >
                        {/* <VictoryBar
                            data={chartData.target}
                            cornerRadius={6}
                            style={{
                                data: {
                                    fill: "#F0F4F7"
                                }
                            }}
                            barWidth={50}
                        /> */}
                        <VictoryBar
                            cornerRadius={6}
                            data={chartData.achieved}
                            labels={({ datum }) => datum.y}
                            style={{
                                data: {
                                    fill: "#4488A9",
                                }
                            }}
                            barWidth={50}
                            animate={{
                                duration: 1000,
                                onLoad: { duration: 1000 },
                            }}
                        />
                    </VictoryGroup>
                    {/* VictoryLegend is used for showing the bar labels means it defines which color denotes each bar */}
                    {/* <VictoryLegend

                        x={Dimension.width / 2 - 80}
                        orientation='horizontal'
                        gutter={30}
                        data={[
                            {
                                name: "Previous Expenses",
                                symbol: {
                                    fill: "#CCCDD2"
                                }
                            },
                            {
                                name: "Current",
                                symbol: {
                                    fill: "#156A94"
                                }
                            }
                        ]} /> */}
                </VictoryChart>
            </SafeAreaView>
        )
    }
}


class CustomDataComponent extends Component {
    render() {
        const { x, y, width, height, style } = this.props;

        return (
            <G>
                {/* Display the data value above the bar */}
                <Text x={x} y={y - 10} textAnchor="middle" fill="black">
                    {y}
                </Text>
                {/* Render the bar */}
                <Rect x={x - 10 / 2} y={y} width={10} height={10} fill={"red"} />
            </G>
        );
    }
}


export default Index;
