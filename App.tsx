import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { RootStackParamList } from './types/navigation'
import HomeScreen from './screens/HomeScreen'
import CreateAlarmScreen from './screens/CreateAlarmScreen'
import EditAlarmScreen from './screens/EditAlarmScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="CreateAlarm" component={CreateAlarmScreen} />
            <Stack.Screen name="EditAlarm" component={EditAlarmScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
