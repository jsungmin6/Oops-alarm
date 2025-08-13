import {StyleSheet, Text, TextInput} from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useFonts } from 'expo-font'
import { RootStackParamList } from './types/navigation'
import HomeScreen from './screens/HomeScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()
let fontConfigured = false

export default function App() {
  const [fontsLoaded] = useFonts({
    'Jua-Regular': require('./assets/font/Jua-Regular.ttf'),
  })

  if (!fontsLoaded) {
    return null
  }

  if (!fontConfigured) {
    const defaultText = Text as any
    const defaultTextInput = TextInput as any

    if (!defaultText.defaultProps) defaultText.defaultProps = {}
    if (!defaultTextInput.defaultProps) defaultTextInput.defaultProps = {}

    const textStyle = defaultText.defaultProps.style
    const textStylesArray = Array.isArray(textStyle)
      ? textStyle
      : textStyle
      ? [textStyle]
      : []
    defaultText.defaultProps.style = [
      { fontFamily: 'Jua-Regular' },
      ...textStylesArray.filter((s: any) => !s || !('fontFamily' in s)),
    ]

    const textInputStyle = defaultTextInput.defaultProps.style
    const textInputStylesArray = Array.isArray(textInputStyle)
      ? textInputStyle
      : textInputStyle
      ? [textInputStyle]
      : []
    defaultTextInput.defaultProps.style = [
      { fontFamily: 'Jua-Regular' },
      ...textInputStylesArray.filter((s: any) => !s || !('fontFamily' in s)),
    ]

    fontConfigured = true
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
