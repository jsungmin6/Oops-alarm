import { useEffect, useState } from 'react'
import { AppState, InteractionManager } from 'react-native'
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
  const [adsReady, setAdsReady] = useState(false)

  // initializeNotifications은 UI 없어도 됨
  useEffect(() => {
    initializeNotifications()
  }, [])

  // ATT 다이얼로그는 앱이 완전히 active 상태일 때만 표시됨
  // iPadOS 26의 새 윈도우 시스템에서는 InteractionManager + RAF만으로 부족할 수 있음
  // AppState가 active인지 확인 후 충분한 지연을 두고 요청
  useEffect(() => {
    if (!fontsLoaded) return
    let cancelled = false

    const tryInitAds = () => {
      const task = InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          if (!cancelled) {
            void initializeMobileAds().then(() => {
              if (!cancelled) setAdsReady(true)
            })
          }
        }, 500)
      })
      return task
    }

    // 이미 active 상태면 바로 시도
    if (AppState.currentState === 'active') {
      const task = tryInitAds()
      return () => {
        cancelled = true
        task.cancel()
      }
    }

    // active가 아니면 active 될 때까지 대기
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && !cancelled) {
        subscription.remove()
        tryInitAds()
      }
    })

    return () => {
      cancelled = true
      subscription.remove()
    }
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
              options={{ headerShown: false }}
            >
              {(props) => <HomeScreen {...props} adsReady={adsReady} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </LocalizationProvider>
    </GestureHandlerRootView>
  )
}
