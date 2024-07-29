import React, { Component } from 'react'
import { SafeAreaView, Text, View } from 'react-native'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryLegend, VictoryTheme } from 'victory-native'


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

    componentDidMount = () => {
    }
    calculateBarWidth = (dataLength) => {
        return dataLength > 6 ? 20 : dataLength > 4 ? 30 : 50;
    }
    // Function to calculate tick values for the y-axis
    calculateTickValues(data) {
        // const yValues = data.map(item => item.y);
        // const maxY = Math.max(...yValues);
        // const minY = Math.min(...yValues);
        // const range = maxY - minY;
        // const step = range / 5;  // Example: create 5 steps. Adjust according to your needs

        // let ticks = [];
        // for (let i = 0; i <= 5; i++) {  // Generates 6 ticks (0 to 5 inclusive)
        //     ticks.push(minY + i * step);
        // }
        // return ticks;
        const yValues = data.map(item => item.y);
        const maxY = Math.max(...yValues);

        // Initialize ticks with the first value being 0
        let ticks = [0];
        let increment = 100; // Start increment at 100
        let currentTick = 0;

        while (currentTick < maxY) {
            currentTick += increment;
            ticks.push(currentTick);
            increment += 100; // Increase the increment by 100 each step
        }

        // Remove last tick if it goes beyond the maximum data value
        // if (ticks[ticks.length - 1] > maxY) {
        //     ticks.pop();
        // }

        return ticks;
    }

     calculateDomainPadding(data) {
        // Example criteria: more padding for fewer data points or based on value ranges
        const numPoints = data.length;
        const yValues = data.map(item => item.y);
        const maxY = Math.max(...yValues);
        const minY = Math.min(...yValues);
        const range = maxY - minY;
    
        // Set base padding
        let padding = 0; // Default padding
    
        // Increase padding if fewer data points
        if (numPoints < 5) {
            padding = 50;
        } else  if (numPoints < 10) {
            padding = 20;
        }
    
        // Adjust padding based on range dynamically
        if (range > 1000) {
            padding += 5; // Larger range, more padding
        }
    
        return { x: padding, y: padding }; // Symmetric padding for x and y
    }


    render() {
        const barWidth = this.calculateBarWidth(this.props.data.length);
        const tickValues = this.calculateTickValues(this.props.data); // Calculate tick values for y-axis
        const domainPadding = this.calculateDomainPadding(this.props.data);

        return (
            <SafeAreaView style={{ marginHorizontal: 15 }}>

                {this.props.data && this.props.data.length > 0 ?
                    // <VictoryChart theme={VictoryTheme.material}
                    //     padding={{ left: 60, top: 20, right: 50, bottom: 50 }}
                    //     height={230}
                    // >
                    //     <VictoryAxis
                    //         style={{
                    //             grid: { stroke: 'none' }, // to hide the grid
                    //             axis: { stroke: "transparent" }, // to make the axis invisible
                    //             ticks: { stroke: "transparent" }, // to hide the line of this particular axis
                    //             tickLabels: { fill: "#738490", fontSize: 12, fontWeight: 600 },


                    //         }}
                    //     />
                    //     <VictoryAxis
                    //         dependentAxis
                    //         offsetX={45}

                    //     />
                    //         <VictoryBar
                    //             cornerRadius={{ bottom: 10, top: 10 }}
                    //             data={this.props.data}
                    //             // labels={({ datum }) => datum.y}
                    //             style={{
                    //                 data: {
                    //                     fill: "#4488A9",
                    //                 }
                    //             }}
                    //             barWidth={barWidth}
                    //             animate={{
                    //                 duration: 1000,
                    //                 onLoad: { duration: 1000 },
                    //             }}
                    //         />
                    // </VictoryChart>
                    <VictoryChart
                        theme={VictoryTheme.material}
                        // domainPadding={40}
                        height={250}
                        domainPadding={domainPadding}
                        padding={{ left: 60, top: 20, right: 50, bottom: 50 }}
                    >
                        <VictoryAxis
                            style={{
                                grid: { stroke: 'none' }, // to hide the grid
                                axis: { stroke: "transparent" }, // to make the axis invisible
                                ticks: { stroke: "transparent" }, // to hide the line of this particular axis
                                tickLabels: { fill: "#738490", fontSize: 11, fontWeight: 600 },
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            tickValues={tickValues} // Dynamically set tick values
                            offsetX={45}
                            style={{
                                grid: { stroke: 'none' }, // to hide the grid
                                // axis: { stroke: "transparent" }, // to make the axis invisible
                                ticks: { stroke: "transparent" }, // to hide the line of this particular axis
                                tickLabels: { fill: "#738490", fontSize: 12, fontWeight: 600 },
                            }}
                        />
                        < VictoryBar
                            labels={({ datum }) => datum.y}
                            style={{ data: { fill: "#4488A9" } }}
                            cornerRadius={{ bottom: 6, top: 6 }}
                            barWidth={barWidth}
                            data={this.props.data}
                        />
                    </VictoryChart>
                    : null
                }
            </SafeAreaView>
        )
    }
}


export default Index;
