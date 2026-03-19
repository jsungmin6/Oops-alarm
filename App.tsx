import { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useFonts } from 'expo-font'
import { RootStackParamList } from './types/navigation'
import HomeScreen from './screens/HomeScreen'
import { LocalizationProvider } from './i18n'
import { initializeMobileAds } from './services/ads'
import { initializeNotifications } from './services/notifications'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  const [fontsLoaded] = useFonts({
    'Jua-Regular': require('./assets/fonts/Jua-Regular.ttf'),
  })

  useEffect(() => {
    void initializeMobileAds()
    initializeNotifications()
  }, [])

  if (!fontsLoaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
      <LocalizationProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </LocalizationProvider>
    </GestureHandlerRootView>
  )
}
