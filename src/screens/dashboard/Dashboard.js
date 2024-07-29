
import React, { Component } from 'react'
import { ActivityIndicator, SafeAreaView } from 'react-native'
import { stateAllCountries, stateCheckForNetwork, stateUserInformation, userSelectedBeatRouteData } from "../../redux/Sales360Action";

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { CustomerDashboard, EmployeeDashboard } from '..';
import { CustomerDashboardTab, EmployeeDashboardTab } from '../../navigation/bottomTabNavigator';
import { AppInfo } from '../../services/config';
import { APP_INDEX } from '../../../globalConstant';
import { MiddlewareOnlyApiCheck } from '../../services/middleware';
import { ErrorCode } from '../../services/constant';
import { CommonActions } from '@react-navigation/native';
import { Toaster } from '../../services/common-view-function';

class Dashboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dashboardLoader: false
        }
    }
    componentDidMount = async () => {
        // this._unsubscribe = this.props.navigation.addListener(
        //     'focus', async () => {
        //         await this.setLoader(true)
        //         await this.setApi()
        //     })
        await this._onGetAppVersionInfo()
    }

    _onGetAppVersionInfo = async () => {
        let reqData = { "packageName": AppInfo.getAppPackageName(), "appIndex": APP_INDEX }
        let responseData = await MiddlewareOnlyApiCheck("getCurrentAppVersionInfo", reqData);
        console.log("getCurrentAppVersionInfo---", JSON.stringify(responseData))
        if (responseData) {
            if (responseData.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR && responseData.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
                this.setState({ versionData: responseData.data })
                if (responseData.data.version !== AppInfo.getCurrentAppVersion()) {
                    if (responseData.data.isUpdate == 2) {
                        this.props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'NewVersionAvailable',"data":responseData.data }] }));
                    } else {
                        if (responseData.data.isUpdate == 1) {
                            Toaster.LongCenterToaster("A new update is available. You can update the apk.");
                            this.setState({ pageLoader: false });
                        }
                        else {
                            this.setState({ pageLoader: false });
                        }
                    }
                }
            } else {
                Toaster.ShortCenterToaster(responseData.message)
            }
        }
    }
    setApi = async () => {
        this.setState({ dashboardLoader: false })
    }
    setLoader = async (type) => {
        this.setState({ dashboardLoader: type })
    }
    render() {
        return (
            <SafeAreaView>
                {this.state.dashboardLoader ?
                    <ActivityIndicator />
                    :
                    <React.Fragment>
                        {this.props.Sales360Redux.loginData.loginType == "employee" ?
                            <EmployeeDashboard {...this.props} />
                            :
                            <CustomerDashboard {...this.props} />
                        }
                    </React.Fragment>
                }

            </SafeAreaView>
        )
    }
}



const mapStateToProps = (state) => {
    const { Sales360Redux } = state;
    return { Sales360Redux };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({
        stateAllCountries,
        stateCheckForNetwork,
        stateUserInformation,
        userSelectedBeatRouteData
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);