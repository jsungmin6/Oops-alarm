import { useEffect } from 'react'
import { InteractionManager } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useFonts } from 'expo-font'
import { RootStackParamList } from './types/navigation'
import HomeScreen from './screens/HomeScreen'
import { LocalizationProvider } from './i18n'
import { initializeMobileAds, showAppOpenAdOnceAsync } from './services/ads'
import { initializeNotifications } from './services/notifications'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  const [fontsLoaded] = useFonts({
    'Jua-Regular': require('./assets/fonts/Jua-Regular.ttf'),
  })

  // initializeNotifications은 UI 없어도 됨
  useEffect(() => {
    initializeNotifications()
  }, [])

  // ATT 다이얼로그는 모든 트랜지션이 끝난 후 요청해야 iOS에서 표시됨
  // InteractionManager: 하드코딩 딜레이 없이 UI가 완전히 준비된 시점을 보장
  useEffect(() => {
    if (!fontsLoaded) return
    const task = InteractionManager.runAfterInteractions(() => {
      void initializeMobileAds().then(() => showAppOpenAdOnceAsync())
    })
    return () => task.cancel()
  }, [fontsLoaded])

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
