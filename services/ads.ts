import mobileAds, {
    AppOpenAd,
    AdEventType,
    TestIds,
} from 'react-native-google-mobile-ads'
import { Platform } from 'react-native'
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency'

const IOS_APP_ID = 'ca-app-pub-2229465145229904~3753268783'
const IOS_NATIVE_AD_UNIT_ID = 'ca-app-pub-2229465145229904/3313717837'
const IOS_APP_OPEN_AD_UNIT_ID = 'ca-app-pub-2229465145229904/9468062648'
const IOS_BANNER_AD_UNIT_ID = 'ca-app-pub-2229465145229904/2435750430'
const ANDROID_APP_ID = 'ca-app-pub-2229465145229904~6093970012'
const ANDROID_BANNER_AD_UNIT_ID = 'ca-app-pub-2229465145229904/6527282530'
const ANDROID_APP_OPEN_AD_UNIT_ID = 'ca-app-pub-2229465145229904/9854219220'

const USE_TEST_NATIVE_ADS = __DEV__
const USE_TEST_APP_OPEN_ADS = __DEV__

export const adConfig = {
    iosAppId: IOS_APP_ID,
    androidAppId: ANDROID_APP_ID,
    nativeAdUnitId:
        USE_TEST_NATIVE_ADS || Platform.OS !== 'ios'
            ? TestIds.NATIVE
            : IOS_NATIVE_AD_UNIT_ID,
    appOpenAdUnitId: USE_TEST_APP_OPEN_ADS
        ? TestIds.APP_OPEN
        : Platform.OS === 'ios'
          ? IOS_APP_OPEN_AD_UNIT_ID
          : ANDROID_APP_OPEN_AD_UNIT_ID || TestIds.APP_OPEN,
    bannerAdUnitId: __DEV__
        ? TestIds.BANNER
        : Platform.OS === 'ios'
          ? IOS_BANNER_AD_UNIT_ID
          : ANDROID_BANNER_AD_UNIT_ID,
    useTestAds: USE_TEST_NATIVE_ADS,
}

let initializePromise: Promise<unknown> | null = null
let appOpenShownThisLaunch = false

export const initializeMobileAds = async () => {
    if (Platform.OS === 'ios') {
        await requestTrackingPermissionsAsync()
    }

    if (!initializePromise) {
        initializePromise = mobileAds().initialize()
    }

    return initializePromise
}

export const showAppOpenAdOnceAsync = async () => {
    if (appOpenShownThisLaunch) {
        return
    }

    const appOpen = AppOpenAd.createForAdRequest(adConfig.appOpenAdUnitId, {
        requestNonPersonalizedAdsOnly: true,
    })

    await new Promise<void>((resolve) => {
        let didFinish = false

        const finish = () => {
            if (didFinish) {
                return
            }

            didFinish = true
            unsubscribeLoaded()
            unsubscribeError()
            unsubscribeClosed()
            unsubscribeOpened()
            resolve()
        }

        const unsubscribeLoaded = appOpen.addAdEventListener(
            AdEventType.LOADED,
            () => {
                appOpenShownThisLaunch = true
                void appOpen.show().catch(() => {
                    appOpenShownThisLaunch = false
                    finish()
                })
            }
        )

        const unsubscribeError = appOpen.addAdEventListener(
            AdEventType.ERROR,
            () => {
                finish()
            }
        )

        const unsubscribeClosed = appOpen.addAdEventListener(
            AdEventType.CLOSED,
            () => {
                finish()
            }
        )

        const unsubscribeOpened = appOpen.addAdEventListener(
            AdEventType.OPENED,
            () => {}
        )

        appOpen.load()

        setTimeout(() => {
            if (!appOpenShownThisLaunch) {
                finish()
            }
        }, 4000)
    })
}
