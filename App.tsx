import {StyleSheet, Text, TextInput} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import { RootStackParamList } from './types/navigation'
import HomeScreen from './screens/HomeScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  const [fontsLoaded] = useFonts({
    'Jua-Regular': require('./assets/font/Jua-Regular.ttf'),
  })

  useEffect(() => {
    if (fontsLoaded) {
      Text.defaultProps = Text.defaultProps || {}
      Text.defaultProps.style = [
        { fontFamily: 'Jua-Regular' },
        Text.defaultProps.style,
      ]

      TextInput.defaultProps = TextInput.defaultProps || {}
      TextInput.defaultProps.style = [
        { fontFamily: 'Jua-Regular' },
        TextInput.defaultProps.style,
      ]
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
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
