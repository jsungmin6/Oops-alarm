import { StyleSheet, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useFonts } from 'expo-font'
import { RootStackParamList } from './types/navigation'
import HomeScreen from './screens/HomeScreen'
import mobileAds from 'react-native-google-mobile-ads'
import { useEffect } from 'react'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  const [fontsLoaded] = useFonts({
    'Jua-Regular': require('./assets/fonts/Jua-Regular.ttf'),
  })

  useEffect(() => {
    mobileAds().initialize()
  }, [])

  if (!fontsLoaded) {
    return null
  }

  const TextComponent = Text as any
  if (TextComponent.defaultProps == null) {
    TextComponent.defaultProps = {}
  }
  TextComponent.defaultProps.style = {
    ...(TextComponent.defaultProps.style || {}),
    fontFamily: 'Jua-Regular',
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
