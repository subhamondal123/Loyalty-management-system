import React from 'react';
import { AlertMessage, Color, FontFamily, ImageName } from '../../enums';
import styles from './Style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { stateCheckForNetwork, stateUserInformation } from "../../redux/Sales360Action";
import {
    SafeAreaView,
    Text,
    View,
    Image,
    ActivityIndicator,
    RefreshControl,
    FlatList
} from 'react-native';
import { ErrorCode } from '../../services/constant';
import { MiddlewareCheck } from '../../services/middleware';
import { getIndex, registrationlistModifyData } from './Function';
import { Loader, Modal, NoDataFound } from '../../shared';
import { DateConvert, Toaster } from '../../services/common-view-function';
import Header from '../header/Header';
import { ExpandableTextView } from '../../pageShared';
import { CustomStyle } from '../style';


class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageLoader: false,
            pageNum: 0,
            limit: 5,
            totalDataCount: 0,
            notificationArrData: [],
            refreshing: true,
            listLoader: true,
            unReadMsg: 0,
            showHideCheckBox: false,
            actionTooltip: false,

            listDataLoader: true,
            isVisibleModal: false,
            modalLoader: false,
            isApiCall: true,

            selectedItem: {}
        }
    }

    _onSetInitialStateData = () => {
        this.setState({
            listDataLoader: true,
            pageNum: 0,
            limit: 5,
            notificationArrData: [],
        })
    }

    componentDidMount() {
        // this._unsubscribe = this.props.navigation.addListener(
        //     'focus', async () => {
        // this._onSetInitialStateData();
        this._load();
        // })
    }

    // componentWillUnmount() {
    //     this.setState = (state, callback) => {
    //         return;
    //     };
    // }

    // for back
    _backAction = () => {
        this._onBack();
    };

    _onBack = () => {
        this.props.navigation.goBack();
    }

    _load = async () => {
        // this._loaderCheck();
        this.setState({ pageLoader: true })
        this.setState({ refreshing: false, });
        let dataReq = {
            "limit": this.state.limit.toString(),
            "offset": (this.state.pageNum * this.state.limit).toString(),
        }
        let responseData = await MiddlewareCheck("notificationList", dataReq, this.props);
        if (responseData) {
            if (responseData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                let registrationList = registrationlistModifyData(responseData.data);
                if (registrationList.notificationList.length == 0) {
                    this.state.isApiCall = false;
                }
                this.setState(this.state)
                this.setState({
                    notificationArrData: [...this.state.notificationArrData, ...registrationList.notificationList],
                    totalDataCount: registrationList.count
                })
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }

        this.setState({
            pageLoader: false,
            listDataLoader: false,
            listLoader: false,
        })

    }

    _loaderCheck = () => {
        this.setState({
            pageLoader: false,
            listLoader: false,
            refreshing: false,
        })
    }

    // _onMarkAllRead = async () => {
    //     let reqData = [];
    //     this.state.unReadMsg = 0;
    //     for (let i = 0; i < this.state.notificationArrData.length; i++) {
    //         if (this.state.notificationArrData[i].isRead == 0) {
    //             reqData.push(this.state.notificationArrData[i].id);
    //             this.state.notificationArrData[i].isRead = 1;
    //         }
    //     }
    //     // let updateData = await this._apiCallForUpdate({ "ids": reqData, "type": "READ" });
    //     if (updateData == true) {
    //         this.setState({
    //             notificationData: this.state.notificationData
    //         })
    //     }
    // }

    // _onCheckNotification = async (item) => {
    //     let key = getIndex(this.state.notificationArrData, item);
    //     // if (item.isRead == 0) {
    //     //     this.state.unReadMsg = this.state.unReadMsg - 1;
    //     //     await this._apiCallForUpdate({ "ids": [item.id], "type": "READ" });
    //     // }
    //     this.state.notificationArrData[key].isCheck = !this.state.notificationArrData[key].isCheck;
    //     this.state.notificationArrData[key].isRead = 1;
    //     this.setState({
    //         notificationData: this.state.notificationData
    //     })
    // }


    _onNetworkError = () => {
        this.props.navigation.navigate("NetworkError");
        this.props.stateCheckForNetwork("Notification");
    }

    // fetch more data
    fetchMore = () => {
        if (this.state.listLoader) {
            return null;
        }
        this.setState(
            (prevState) => {
                return { listLoader: true, pageNum: prevState.pageNum + 1 };
            },
            () => {
                if (this.state.isApiCall) {
                    this._load();
                } else {
                    this.setState({ listLoader: false })
                    return null;
                }
            }
        );
    };


    renderLoader = () => {
        return this.state.listLoader ? (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 100,
                }}
            >
                <ActivityIndicator
                    size="large"
                    color={Color.COLOR.INDICATOR_COLOR.GRAY}
                />
            </View>
        ) : (
            <View style={{ marginBottom: 200 }} />
        );
    };

    // change the state for refresh
    _onStatusChange = async () => {
        this.setState({
            pageNum: 0,
            limit: 5,
            totalDataCount: 0,
            isApiCall: true,
            notificationArrData: [],
            listLoader: false,
            refreshing: true,
            pageLoader: true,
            listDataLoader: true,
        })
    }

    onRefresh = async () => {
        this.setState({
            notificationArrData: [],
        })
        await this._onStatusChange();
        await this._load();
    }

    _onPopupModal = (item) => {
        if (this.state.isVisibleModal == false) {
            this.setState({
                isVisibleModal: true,
                selectedItem: item
            })
        } else {
            this.setState({
                isVisibleModal: false
            })
        }

    }

    _onListDelete = async () => {
        this.setState({
            modalLoader: true
        })
        let key = getIndex(this.state.notificationArrData, this.state.selectedItem);
        this.state.notificationArrData.splice(key, 1);
        this.state.totalDataCount = this.state.totalDataCount - 1;
        this.setState({
            notificationArrData: this.state.notificationArrData,
            totalDataCount: this.state.totalDataCount
        })
        let reqData = {
            "platform": "android",
            "ids": [this.state.selectedItem.id.toString()],
        }
        let responseData = await MiddlewareCheck("deleteNotification", reqData, this.props);
        if (responseData === false) {
            this._onNetworkError();
        } else {
            if (responseData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && responseData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                Toaster.ShortCenterToaster(responseData.data.message);
                this._onPopupModal()
            } else {
                Toaster.ShortCenterToaster(AlertMessage.MESSAGE.SERVER.INTERNAL_SERVER_ERROR);
            }
        }
        this.setState({
            modalLoader: false
        })
    }

    // rendering the data
    renderNotificationItem = ({ item, key }) => {
        return (
            <View key={key}>
                <View style={{}}>
                    {this.ListData(item, key)}
                </View>
            </View>
        );
    };

    _onPressNotification = (item) => {
        if (item.refType) {
            if (item.refType == "newPjp_retail") {
                this.props.navigation.navigate("PjpAndVisitList", { type: "newPjp" });
            } else if (item.refType == "newPjp_project") {
                this.props.navigation.navigate("ProjectPjpAndVisitedList", { type: "newPjp" });
            } else if (item.refType == "newBrandingRequisition") {
                this.props.navigation.navigate("PjpAndVisitList", { type: "newBrandingRequisition" });
            } else if (item.refType == "fieldVisitNotification") {
                this.props.navigation.navigate("PjpAndVisitList", { type: "fieldVisitNotification" });
            } else if (item.refType == "jointVisitRequest") {
                this.props.navigation.navigate("RequestList", { type: "jointVisitRequest" });
            } else if (item.refType == "addNewLead") {
                this.props.navigation.navigate("SfaEnquiryList", { type: "addNewLead" });
            } else if (item.refType == "leadAssignUpdate") {
                this.props.navigation.navigate("LeadsList", { type: "leadAssignUpdate" });
            } else if (item.refType == "leadToOpportunity") {
                this.props.navigation.navigate("OpportunityList", { type: "leadToOpportunity" });
            } else if (item.refType == "opportunityToCustomer") {
                this.props.navigation.navigate("Partners", { type: "opportunityToCustomer" });
            } else if (item.refType == "taskAssigned") {
                this.props.navigation.navigate("TaskList", { type: "taskAssigned" });
            } else if (item.refType == "EnquiryLeadAssigned") {
                this.props.navigation.navigate("SfaEnquiryList", { type: "EnquiryLeadAssigned" });
            }
        }
    }

    ListData = (item, key) => {
        return (
            <React.Fragment>
                {/* <View style={[styles.contentSec, item.isSeen == 1 ? { backgroundColor: Color.COLOR.BLUE.LIGHT_BLUE } : {}]}> */}
                <View style={styles.contentSec}>
                    {/* <TouchableOpacity
                        style={{ marginHorizontal: '2%', flexDirection: 'row', alignItems: 'center' }}
                        activeOpacity={0.9}
                        onPress={() => this._onPressNotification(item)}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Image source={{ uri: item.image }} style={styles.notificationImg} />
                            <View style={styles.textSec}>
                                <Text style={item.isSeen == 1 ? styles.textInactive : styles.text}>{item.subject}</Text>
                                <Text style={item.isSeen == 1 ? styles.bodyTextInactive : styles.bodyText}>{item.body}</Text>
                                <Text style={styles.dateTimeText}>{DateConvert.viewDateFormat(item.createdAt)}</Text>
                            </View>
                        </View>
                       
                        <View style={{ flexDirection: 'column' }}>
                            {item.isSeen == 1 ?
                                <TouchableOpacity
                                    onPress={() => this._onPopupModal(item)}
                                    activeOpacity={0.7}
                                    style={{}}>
                                    <Image source={ImageName.DELETE_WITH_RED} style={styles.deleteImg} />
                                </TouchableOpacity> :
                                <React.Fragment >
                                    <View style={{ top: -5, marginRight: '2%' }}>
                                        <View style={styles.redCircel}>
                                            <View style={styles.Circel} />
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this._onPopupModal(item)}
                                        activeOpacity={0.7}
                                        style={{}}>
                                        <Image source={ImageName.DELETE_WITH_RED} style={styles.deleteImg} />
                                    </TouchableOpacity>
                                </React.Fragment>
                            }
                        </View>
                    </TouchableOpacity> */}



                    <View style={styles.notificationSec}>
                        <View>
                            <Image source={ImageName.YELLOW_COIN_ICON} style={{ height: 25, width: 25, resizeMode: 'contain' }} />
                        </View>
                        <View style={styles.notificationTextSec}>
                            {/* <Text style={item.isSeen == 1 ? styles.textInactive : styles.text}>{item.subject}</Text>
                            <Text style={styles.notibody}>{item.body}</Text> */}
                            <ExpandableTextView
                                additionalTextStyle={{ fontSize: 13, color: Color.COLOR.BLUE.LOTUS_BLUE, fontFamily: FontFamily.FONTS.POPPINS.REGULAR }}
                                maxLength={100}
                                data={item.body} />

                        </View>
                    </View>
                </View>
                <View style={styles.spaceUnderline} />
            </React.Fragment>
        )
    }

    filterSection = () => {
        return (
            <React.Fragment>
                <View style={{ marginHorizontal: 15 }}>
                    <View style={styles.filterSec}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.dgText}>Today</Text>
                        </View>
                        {/* <View>
                            <Image source={ImageName.FILTER_LOGO} style={{ height: 22, width: 22, resizeMode: 'contain', marginTop: 12 }} />
                        </View> */}
                    </View>
                    <View style={styles.filterUnderLIne} />
                </View>
            </React.Fragment>
        )
    }
    // ..............open action header tooltip ............


    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header {...this.props} onRefresh={() => console.log("")} />
                {this.state.listDataLoader ?
                    <View style={styles.loaderView}>
                        <Loader />
                    </View> :
                    <React.Fragment>
                        {this.filterSection()}
                        {this.state.notificationArrData.length > 0 ? (
                            <React.Fragment>
                                <FlatList
                                    data={this.state.notificationArrData}
                                    renderItem={(item, key) => this.renderNotificationItem(item, key)}
                                    keyExtractor={(item, key) => key}
                                    onEndReached={this.fetchMore}
                                    onEndReachedThreshold={0.1}
                                    ListFooterComponent={this.renderLoader}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={() => this.onRefresh()}
                                        />
                                    }
                                />
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <View style={CustomStyle.noDataFoundViewForTabList}>
                                    <NoDataFound />
                                </View>
                            </React.Fragment>
                        )}
                    </React.Fragment>}
            </SafeAreaView >
        );
    }
};


const mapStateToProps = (state) => {
    const { Sales360Redux } = state
    return { Sales360Redux }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        stateCheckForNetwork,
        stateUserInformation
    }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(Notification);