import React, { Component } from 'react'
import { RefreshControl, SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native'
import { ActivePointCard, DynamicCategoryTab, InfluencerActivePointCard, InfluencerDashboardChart, LmsInfluencerActivitySelectionTab, ProfileSec } from '../../pageShared'
import { Text } from 'react-native'
import Header from '../header/Header'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import styles from './Style'
import { Dimension, FontFamily, ImageName } from '../../enums'
import { Image } from 'react-native'
import SvgComponent from '../../assets/svg'
import { MiddlewareCheck } from '../../services/middleware'
import { ErrorCode } from '../../services/constant'


const data = {
    target: [
        { x: "Lock", y: 10000, },
        { x: "Active", y: 10000 },
        { x: "Exp 80", y: 10000 },
        { x: "Exp 60", y: 10000 },
        { x: "Exp 30", y: 10000 }
    ],
    achieved: [
        { x: "Lock", y: 1000 },
        { x: "Active", y: 7200 },
        { x: "Exp 80", y: 8000 },
        { x: "Exp 60", y: 2000 },
        { x: "Exp 30", y: 4210 }
    ],
}

const tabData = [
    {
        id: 1,
        text: "Category 1",
        check: true
    },
    {
        id: 2,
        text: "Category 2",
        check: false
    },
    {
        id: 3,
        text: "Category 3",
        check: false
    },
    {
        id: 4,
        text: "Category 4",
        check: false
    },
    {
        id: 5,
        text: "Category 5",
        check: false
    },
]

export default class InfluencerActivityDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tabData: tabData,
            tabLoader: false,
            chartData: {},
            chartLoader: true,
            cardLoader: true,
            refreshing: true,
            tabLoader: false,
            propData: this.props.route.params.propData
        }
    }
    componentDidMount = () => {
        // this._unsubscribe = this.props.navigation.addListener(
        //     'focus', async () => {
        this.load()
        // })
    }

    load = async () => {
        this.setState({ refreshing: false, })
        await this.getChartData()
        await this.setTabLoader(false)
        await this.setChartLoader(false)
        await this.setCardLoader(false)
    }
    setTabLoader = async (type) => {
        this.setState({ tabLoader: type })
    }
    setChartLoader = async (type) => {
        this.setState({ chartLoader: type })
    }
    setCardLoader = async (type) => {
        this.setState({ cardLoader: type })
    }

    getChartData = async () => {
        let reqData = {
            refUserId: this.state.propData.id.toString()
        }
        let responseData = await MiddlewareCheck("dashboardChart", reqData, this.props)
        if (responseData) {
            if (responseData.status === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({ chartData: responseData.response })
            }
        }
    }

    onSelectTab = () => {
    }

    // for users activity section
    onUserActivitySelectionSection = () => {
        return (
            <>
                {this.state.refreshing ? null :
                    <LmsInfluencerActivitySelectionTab {...this.props} onClickItem={() => this.onSelectTab()} />
                }
            </>
        );

    }

    pointSec = () => {
        const onSelect = () => {
            console.log("")
        }
        return (
            <View style={{ marginTop: 10 }}>
                {this.state.cardLoader ? null :
                    <InfluencerActivePointCard props={this.props} onPress={() => onSelect()} data={this.state.chartData} />
                }
            </View>
        )
    }

    graphSec = () => {
        return (
            <View style={{ justifyContent: "center", alignItems: "center", }}>
                <InfluencerDashboardChart data={this.state.chartData}  {...this.props} />
            </View>
        )
    }

    onRefresh = async () => {
        // this.onClearStateData();
        await this.setChartLoader(true)
        await this.setTabLoader(true)
        await this.setCardLoader(true)
        this.setState({
            refreshing: true,
        })
        await this.load()
    }


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header onRefresh={() => console.log("")} {...this.props} />
                <ProfileSec props={this.props} />
                <ScrollView showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this.onRefresh()}
                        />
                    }
                >
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        horizontal={true}
                    >
                        <View style={{ flexDirection: "row", marginTop: 15, marginHorizontal: 20 }}>
                            {this.state.tabLoader ? null : this.onUserActivitySelectionSection()}
                        </View>

                    </ScrollView>
                    {this.pointSec()}
                    {this.state.chartLoader ? null : this.graphSec()}
                    {/* {this.tabSec()} */}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>
        )
    }
}
