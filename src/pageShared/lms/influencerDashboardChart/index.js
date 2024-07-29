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


class InfluencerDashboardChart extends Component {
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
            <SafeAreaView>

                <VictoryChart theme={VictoryTheme.material}

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
                        tickCount={6}
                        dependentAxis
                        tickValues={[4, 6, 8]}
                        crossAxis={false}
                        offsetX={45}
                        style={{
                            grid: { stroke: 'none' },
                            axis: { stroke: "transparent" }, // to make the axis invisible
                            ticks: { stroke: "transparent" },
                            // tickLabels: { fill: "#63677A", fontSize: 10, fontWeight: 400 }
                            tickLabels: { fill: 'transparent' }, // Make the tick labels invisible
                        }}


                    />
                    {/* <VictoryAxis label="Week"/> */}
                    <VictoryGroup offset={0}  >
                        <VictoryBar
                            data={this.props.data.target}
                            cornerRadius={6}
                            // labels={({ datum }) => datum.y}  

                            style={{
                                data: {
                                    fill: "#F0F4F7"  //set backgroud color of the bar
                                }
                            }}
                            barWidth={50} // Set a fixed width for all bars
                        />
                        <VictoryBar
                            cornerRadius={6}
                            data={this.props.data.achieved}
                            labels={({ datum }) => datum.y}
                            style={{
                                data: {
                                    fill: ({ datum }) => datum.x == "Lock" ? "#BEEBFF" : datum.x == "Active" ? "#ADFFC8" : datum.x == "Exp 80" ? "#DFE782" : datum.x == "Exp 60" ? "#FFDF8C" : "#FFCEBF",
                                }
                            }}
                            barWidth={50} // Set a fixed width for all bars
                            // dataComponent={<CustomDataComponent />} // Use a custom data component
                            animate={{
                                duration: 1000, // Animation duration in milliseconds
                                onLoad: { duration: 1000 }, // Animation duration for initial load
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

export default InfluencerDashboardChart;
