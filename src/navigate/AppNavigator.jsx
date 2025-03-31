import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import TablesScreen from '../screens/TablesScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import ConfirmAccountScreen from '../screens/ConfirmAccountScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#9B1C31" />
      <Stack.Navigator screenOptions={{ headerTitle: "", headerShown: false }}>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            headerShown: false,
            statusBarStyle: 'light-content',
            statusBarBackgroundColor: '#9B1C31',
          }}
        />
        <Stack.Screen
          name="TablesScreen"
          component={TablesScreen}
          options={{
            headerShown: false,
            statusBarStyle: 'light-content',
            statusBarBackgroundColor: '#9B1C31',
          }}
        />
        <Stack.Screen
          name="CreateAccountScreen"
          component={CreateAccountScreen}
          options={{
            headerShown: false,
            statusBarStyle: 'dark-content',
            statusBarBackgroundColor: '#FFF',
          }}
        />
        <Stack.Screen
          name="ConfirmAccountScreen"
          component={ConfirmAccountScreen}
          options={{
            headerShown: false,
            statusBarStyle: 'dark-content',
            statusBarBackgroundColor: '#FFF',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;