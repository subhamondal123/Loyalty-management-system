import * as React from 'react';
import { View, Image, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Color, FontFamily } from '../../enums';
import SvgComponent from '../../assets/svg';
import {
    stateCheckForNetwork,
    stateUserInformation,
    stateAllCountries,
    stateCartData,
    stateDayActivitySelectionData,
    userSelectedBeatRouteData
} from '../../redux/Sales360Action';
import {
    selectUnselectTabView
} from './function';
import { ActivityScreen, Catalogue, CatalogueItemDetails, CustomerDashboard, CustomerList, Dashboard, EmployeeDashboard, GetSalesConfirmation, GlobalItemDetails, InfluencerActivityDetails, InfluencerCatalogue, InfluencerCatalogueItemDetails, InfluencerPassbookAndRedemption, LmsNewCustomerRegistration, Notification, Passbook, ProfilePage, RedemptionDetails, ReedemScreen, RequestRedemtionCategory, SalesConfirmation, SchemePage, StockUpdate, ValidateSales } from '../../screens';
import { Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PassbookAmdRedemption from '../../screens/passbookAndRedemption/PassbookAmdRedemption';
// import { AllCustomers, CustomerSalesConfirmation, CustomerStockUpdate } from '../../screens/customer';


const Tab = createBottomTabNavigator();

// for main bottom tab navigation
class MainBottomTabScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false,
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="Dashboard"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    activeTintColor: 'rgb(29,128,226)',
                    tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}

            >
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    // listeners={({ navigation }) => ({
                    //     tabPress: (e) => {
                    //         Toaster.ShortCenterToaster("helllloooooo")
                    //     //   e.preventDefault(); // Prevents the default behavior (navigating to the tab's screen)
                    //       // Perform your custom action here
                    //     },
                    //   })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"home"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                {/* <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                /> */}
                {/* <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                /> */}

            </Tab.Navigator>
        );
    }
}


// for Profile Page  from page
class ProfileTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="ProfilePage"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="ProfilePage" component={ProfilePage}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                {/* <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                /> */}
                {/* <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                /> */}
            </Tab.Navigator>
        );
    }
}



// for catalogue Page  from page
class CatalogueTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="Catalogue"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="Catalogue"
                    children={() => <Catalogue {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                {/* <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                /> */}
            </Tab.Navigator>
        );
    }
}


// for catalogue Page  from page
class CatalogueDetailsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="CatalogueItemDetails"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="CatalogueItemDetails"
                    children={() => <CatalogueItemDetails {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                {/* <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                /> */}
            </Tab.Navigator>
        );
    }
}


// for influencer catalogue details Page  from page
class InfluencerCatalogueDetailsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="InfluencerCatalogueItemDetails"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="InfluencerCatalogueItemDetails"
                    children={() => <InfluencerCatalogueItemDetails {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}


// for Global catalogue details Page  from page
class GlobalCatalogueDetailsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="GlobalCatalogueItemDetails"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="GlobalCatalogueItemDetails"
                    children={() => <GlobalItemDetails {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}


// for passbook page  from page
class PassbookTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="PassbookAndRedemption"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="PassbookAndRedemption"
                    children={() => <PassbookAmdRedemption {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                {/* <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                /> */}
            </Tab.Navigator>
        );
    }
}




// for Notification Page  from page
class NotificationTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="Notification"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="Notification"
                    children={() => <Notification {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                {/* <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                /> */}
                {/* <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                /> */}
            </Tab.Navigator>
        );
    }
}


// for redemptiondetails page  from page
class RedemptionDetailsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="RedemptionDetails"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="RedemptionDetails" 
                    children={() => <RedemptionDetails {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                {/* <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                /> */}
            </Tab.Navigator>
        );
    }
}


// for SalesConfirmation page  from page
class SalesConfirmationTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="SalesConfirmation"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="SalesConfirmation"
                    children={() => <SalesConfirmation {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}


// for  fetch SalesConfirmation page  from page
class GetSalesConfirmationTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="GetSalesConfirmation"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="GetSalesConfirmation"
                    children={() => <GetSalesConfirmation {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}



// for validate sales page  from page
class ValidateSalesTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="ValidateSales"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="ValidateSales"
                    children={() => <ValidateSales {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}



// for redemption category page  from page
class RequestRedemtionCategoryTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="RequestRedemtionCategory"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="RequestRedemtionCategory"
                    children={() => <RequestRedemtionCategory {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                {/* <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                /> */}
            </Tab.Navigator>
        );
    }
}

// for stock update page  from page
class StockUpdateTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="StockUpdatePage"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="StockUpdatePage"
                    children={() => <StockUpdate {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}



// for employee dashboard page  from page
class EmployeeDashboardTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="EmployeeDashboard"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >

                <Tab.Screen
                    name="EmployeeDashBoard"
                    // component={EmployeeDashboard}
                    children={() => <EmployeeDashboard {...this.props} />}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}


// for customer list page  from page
class CustomerListTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator

                initialRouteName="CustomerListTab"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="CustomerListTab"
                    children={() => <CustomerList {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                {/* <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                /> */}
                {/* <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                /> */}
            </Tab.Navigator>
        );
    }
}

// for influencer activity page  from page
class InfluencerActivityDetailsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="InfluencerActivityDetails"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="InfluencerActivityDetails"
                    children={() => <InfluencerActivityDetails {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}



// for new customer registration page  from page
class NewCustomerRegistrationTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="NewCustomerRegistration"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="NewCustomerRegistration"
                    children={() => <LmsNewCustomerRegistration {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{
                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}


// for new customer Dashboard page  from page
class CustomerDashboardTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="CustomerDashboardTab"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="CustomerDashboardTab"
                    children={() => <CustomerDashboard {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="CustomerDashboard"
                    component={CustomerDashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                {/* <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                /> */}
                {/* <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Activity
                            </Text>
                        ),
                    }}
                /> */}
            </Tab.Navigator>
        );
    }
}


// for offers Page  from page
class OffersTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="SchemePage"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="SchemePage"
                    children={() => <SchemePage {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}




//======================Influencerrrrrrr==========================


// for Imfluencer passbook page  from page
class InfluencerPassbookTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="InfluencerPassbookAndRedemption"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="InfluencerPassbookAndRedemption"
                    children={() => <InfluencerPassbookAndRedemption {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}


// for influencer catalogue Page  from page
class InfluencerCatalogueTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator
                initialRouteName="InfluencerCatalogue"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="InfluencerCatalogue"
                    children={() => <InfluencerCatalogue {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}




// for passbook list page  from page
class PassbookListTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fevMenuShowCheck: false
        }
    }
    render() {
        return (
            <Tab.Navigator

                initialRouteName="PassbookListTab"
                screenOptions={{
                    tabBarStyle: { backgroundColor: Color.COLOR.WHITE.PURE_WHITE, height: 80, paddingTop: 10, paddingBottom: 10 },
                    // activeTintColor: 'rgb(29,128,226)',
                    // tabBarInactiveTintColor: 'rgb(146,146,146)',
                    tabBarHideOnKeyboard: true,
                    tabBarShowLabel: true
                }}
            >
                <Tab.Screen name="PassbookListTab"
                    children={() => <Passbook {...this.props} />}
                    // listeners={{
                    //     tabPress: e => { GetFooterData() },
                    // }}
                    options={{

                        headerShown: false,
                        tabBarButton: () => null
                    }} />
                <Tab.Screen
                    name="Dashboard"
                    component={Dashboard}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"lmsHome"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Home
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SchemePage"
                    component={SchemePage}
                    // listeners={({ navigation }) => ({
                    //     tabPress: e => {
                    //         e.preventDefault();
                    //         navigation.dispatch(DrawerActions.toggleDrawer());
                    //     }
                    // })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"fourDot"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Offer
                            </Text>
                        ),
                    }}
                />

                <Tab.Screen
                    name="ReedemScreen"
                    component={ReedemScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"userWithPlus"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Reedem
                            </Text>
                        ),
                    }}
                />
                <Tab.Screen
                    name="ActivityScreen"
                    component={ActivityScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused }) => (
                            <View style={selectUnselectTabView(focused)}>
                                <SvgComponent svgName={"plusWithCircle"} strokeColor={focused ? "#fff" : "#1F2B4D"} />
                            </View>
                        ),
                        tabBarLabel: ({ focused, color }) => (
                            <Text style={{ color: focused ? "#1F2B4D" : "#3C3C3C", fontSize: 12, fontWeight: focused ? 'bold' : 'normal', fontFamily: FontFamily.FONTS.INTER.REGULAR }}>
                                Add Activity
                            </Text>
                        ),
                    }}
                />
            </Tab.Navigator>
        );
    }
}



const mapStateToProps = (state) => {
    const { Sales360Redux } = state
    return { Sales360Redux }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        stateCheckForNetwork,
        stateUserInformation,
        stateAllCountries,
        stateCartData,
        stateDayActivitySelectionData,
        userSelectedBeatRouteData
    }, dispatch)
);



// Connect home to Redux
const MainBottomTab = connect(mapStateToProps, mapDispatchToProps)(MainBottomTabScreen);

const ProfileTabScreen = connect(mapStateToProps, mapDispatchToProps)(ProfileTab);


export {
    MainBottomTab,
    ProfileTabScreen,
    CatalogueTab,
    CatalogueDetailsTab,
    PassbookTab,
    RedemptionDetailsTab,
    SalesConfirmationTab,
    ValidateSalesTab,
    RequestRedemtionCategoryTab,
    StockUpdateTab,
    EmployeeDashboardTab,
    CustomerListTab,
    InfluencerActivityDetailsTab,
    NewCustomerRegistrationTab,
    CustomerDashboardTab,
    InfluencerPassbookTab,
    InfluencerCatalogueTab,
    OffersTab,
    GetSalesConfirmationTab,
    NotificationTab,
    InfluencerCatalogueDetailsTab,
    GlobalCatalogueDetailsTab,

    PassbookListTab
};