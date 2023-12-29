import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Orientation from 'react-native-orientation-locker';
import GameLevel from './components/gamelevels';
import GameScreen from './components/gamescreen';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    Orientation.lockToLandscape();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GameLevel">
        <Stack.Screen name="GameLevel" component={GameLevel}  options={{ headerShown: false }} />
        <Stack.Screen name="GameScreen" component={GameScreen}  options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default App;