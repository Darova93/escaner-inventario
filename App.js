import React from 'react';
import { StyleSheet } from 'react-native';
import QRScanner from './screens/QRScanner';
import DataViewer from './screens/DataViewer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function renderDataViewer() {
  const isFocused = useIsFocused();
  return(
    <DataViewer isFocused={isFocused} />
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons = {
              Escaner: 'scanner',
              Datos: 'view-list',
            };

            return (
              <MaterialCommunityIcons
                name={icons[route.name]}
                color={color}
                size={size}
              />
            );
          },
        })}
      >
        <Tab.Screen name="Escaner" component={QRScanner} />
        <Tab.Screen name="Datos" component={renderDataViewer} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    backgroundColor: 'black',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});