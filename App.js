import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from "react-redux";
import { createStore } from "redux";
import CRMSalesReducer from "./src/redux/Sales360Reducer";
import {
  SplashScreen,
  Login,
  EmployeeDashboard,
  NetworkError,
  Dashboard,
  ConfirmLiftingList,
  LmsNewCustomerRegistration,
  UpdateLiftingForm,
  ConfirmLiftingListForCustomer,
  UpdateLiftingFormForCustomer,
  AllRecentLiftingList,
  AllRecentLiftingListCustomer,
  ForgotPassword,
  MailCheck,
  OtpVerifyChangePassword,
  CreateNewPassword,
  PasswordUpdateSuccess,
  ChangePassword,
  NewVersionAvailable,
  OrderCartDetails,
  RequestForPasswordSuccess,
} from './src/screens';

import { DrawerNav } from './src/navigation';
import { LogBox } from 'react-native';
import { DateConvert, GetUserData } from './src/services/common-view-function';
import { MiddlewareCheck } from './src/services/middleware';
import { CatalogueDetailsTab, CatalogueTab, CustomerListTab, GetSalesConfirmationTab, GlobalCatalogueDetailsTab, InfluencerActivityDetailsTab, InfluencerCatalogueDetailsTab, InfluencerCatalogueTab, InfluencerPassbookTab, NewCustomerRegistrationTab, NotificationTab, OffersTab, PassbookListTab, PassbookTab, ProfileTabScreen, RedemptionDetailsTab, RequestRedemtionCategoryTab, SalesConfirmationTab, StockUpdateTab, ValidateSalesTab } from './src/navigation/bottomTabNavigator';


const store = createStore(CRMSalesReducer);

const Stack = createStackNavigator();


LogBox.ignoreLogs([
  "Require cycle: node_modules/victory",
]);


class App extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount = () => {
    //get the lat long on 30 min of interval
    // setInterval(async () => {
    //   let loc = await GetUserData.getUserLocation();
    //   let reqData = {
    //     lattitude: loc.lattitude,
    //     longitude: loc.longitude,
    //     currentTimeStamp: DateConvert.fullDateFormat(new Date()),
    //     address: ""
    //   }
    //   await MiddlewareCheck("getCurrentLocation", reqData, this.props);
    // }, 1800000);
  }
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SplashScreen">
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="LogIn" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="DrawerNav" component={DrawerNav} options={{ headerShown: false }} />

            <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
            {/* <Stack.Screen name="EmployeeDashboard" component={EmployeeDashboard} options={{ headerShown: false }} /> */}
            <Stack.Screen name='Catalogue' component={CatalogueTab} options={{ headerShown: false }} />
            <Stack.Screen name='InfluencerCatalogue' component={InfluencerCatalogueTab} options={{ headerShown: false }} />
            <Stack.Screen name='CatalogueItemDetails' component={CatalogueDetailsTab} options={{ headerShown: false }} />
            <Stack.Screen name='InfluencerCatalogueItemDetails' component={InfluencerCatalogueDetailsTab} options={{ headerShown: false }} />
            <Stack.Screen name='GlobalCatalogueItemDetails' component={GlobalCatalogueDetailsTab} options={{ headerShown: false }} />

            {/* <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} options={{ headerShown: false }} /> */}
            <Stack.Screen name="ProfilePage" component={ProfileTabScreen} options={{ headerShown: false }} />
            <Stack.Screen name='PassbookAndRedemption' component={PassbookTab} options={{ headerShown: false }} />
            <Stack.Screen name='InfluencerPassbookAndRedemption' component={InfluencerPassbookTab} options={{ headerShown: false }} />
            <Stack.Screen name="RedemptionDetails" component={RedemptionDetailsTab} options={{ headerShown: false }} />
            <Stack.Screen name='GetSalesConfirmation' component={GetSalesConfirmationTab} options={{ headerShown: false }} />

            <Stack.Screen name='SalesConfirmation' component={SalesConfirmationTab} options={{ headerShown: false }} />
            <Stack.Screen name='ValidateSales' component={ValidateSalesTab} options={{ headerShown: false }} />
            <Stack.Screen name='RequestRedemtionCategory' component={RequestRedemtionCategoryTab} options={{ headerShown: false }} />
            <Stack.Screen name='StockUpdatePage' component={StockUpdateTab} options={{ headerShown: false }} />

            <Stack.Screen name='CustomerListTab' component={CustomerListTab} options={{ headerShown: false }} />

            <Stack.Screen name='InfluencerActivityDetails' component={InfluencerActivityDetailsTab} options={{ headerShown: false }} />
            {/* <Stack.Screen name='NewCustomerRegistration' component={NewCustomerRegistrationTab} options={{ headerShown: false }} /> */}
            <Stack.Screen name='NewCustomerRegistration' component={LmsNewCustomerRegistration} options={{ headerShown: false }} />


            <Stack.Screen name='SchemePage' component={OffersTab} options={{ headerShown: false }} />
            <Stack.Screen name='Notification' component={NotificationTab} options={{ headerShown: false }} />


            {/* NEW */}

            <Stack.Screen name='UpdateLiftingForm' component={UpdateLiftingForm} options={{ headerShown: false }} />
            <Stack.Screen name='ConfirmNewLifting' component={ConfirmLiftingList} options={{ headerShown: false }} />

            <Stack.Screen name='ConfirmLiftingListForCustomer' component={ConfirmLiftingListForCustomer} options={{ headerShown: false }} />
            <Stack.Screen name='UpdateLiftingFormForCustomer' component={UpdateLiftingFormForCustomer} options={{ headerShown: false }} />
            <Stack.Screen name='PassbookListTab' component={PassbookListTab} options={{ headerShown: false }} />


            <Stack.Screen name='AllRecentLiftingList' component={AllRecentLiftingList} options={{ headerShown: false }} />
            <Stack.Screen name='AllRecentLiftingListCustomer' component={AllRecentLiftingListCustomer} options={{ headerShown: false }} />

            <Stack.Screen name="NetworkError" component={NetworkError} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
            <Stack.Screen name="MailCheck" component={MailCheck} options={{ headerShown: false }} />
            <Stack.Screen name="OtpVerifyChangePassword" component={OtpVerifyChangePassword} options={{ headerShown: false }} />
            <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} options={{ headerShown: false }} />
            <Stack.Screen name="PasswordUpdateSuccess" component={PasswordUpdateSuccess} options={{ headerShown: false }} />
            <Stack.Screen name="RequestForPasswordSuccess" component={RequestForPasswordSuccess} options={{ headerShown: false }} />
            <Stack.Screen name='NewVersionAvailable' component={NewVersionAvailable} options={{ headerShown: false }} />


            <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
            <Stack.Screen name="OrderCartDetails" component={OrderCartDetails} options={{ headerShown: false }} />

          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App;