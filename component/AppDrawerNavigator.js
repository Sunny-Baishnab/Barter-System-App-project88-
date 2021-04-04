import React ,{Component} from 'react';
import {Text,View} from 'react-native';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingScreen from '../screens/SettingScreen';
import MyBartersScreen from '../screens/MyBartersScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import MyReceivedItemsScreen from '../screens/MyReceivedItemsScreen';

export const AppDrawerNavigator = createDrawerNavigator({
    Home:{
        screen:AppTabNavigator
    },
    Settings:{
        screen:SettingScreen
    },
    MyBarters:{
        screen:MyBartersScreen
    },
    MyReceivedItems:{
        screen:MyReceivedItemsScreen
    },
    Notifications:{
        screen:NotificationsScreen
    },
},
{
    contentComponent:CustomSideBarMenu
},
{
    initialRouteName:'Home'

})