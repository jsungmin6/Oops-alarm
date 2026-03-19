import mobileAds, {
    AppOpenAd,
    AdEventType,
    TestIds,
} from 'react-native-google-mobile-ads'
import { Platform } from 'react-native'

const IOS_APP_ID = 'ca-app-pub-2229465145229904~3753268783'
const IOS_NATIVE_AD_UNIT_ID = 'ca-app-pub-2229465145229904/3313717837'
const IOS_APP_OPEN_AD_UNIT_ID = 'ca-app-pub-2229465145229904/9468062648'
const IOS_BANNER_AD_UNIT_ID = 'ca-app-pub-2229465145229904/2435750430'
const ANDROID_TEST_APP_ID = 'ca-app-pub-3940256099942544~3347511713'

const USE_TEST_NATIVE_ADS = true
const USE_TEST_APP_OPEN_ADS = false

export const adConfig = {
    iosAppId: IOS_APP_ID,
    androidAppId: ANDROID_TEST_APP_ID,
    nativeAdUnitId:
        USE_TEST_NATIVE_ADS || Platform.OS !== 'ios'
            ? TestIds.NATIVE
            : IOS_NATIVE_AD_UNIT_ID,
    appOpenAdUnitId:
        USE_TEST_APP_OPEN_ADS
            ? TestIds.APP_OPEN
            : Platform.OS === 'ios'
              ? IOS_APP_OPEN_AD_UNIT_ID
              : TestIds.APP_OPEN,
    bannerAdUnitId: Platform.select({
        ios: IOS_BANNER_AD_UNIT_ID,
        default: TestIds.BANNER,
    }),
    useTestAds: USE_TEST_NATIVE_ADS,
}

let initializePromise: Promise<unknown> | null = null
let appOpenShownThisLaunch = false

export const initializeMobileAds = () => {
    if (!initializePromise) {
        initializePromise = mobileAds().initialize()
    }

    return initializePromise
}

export const showAppOpenAdOnceAsync = async () => {
    if (appOpenShownThisLaunch) {
        return
    }

    const appOpen = AppOpenAd.createForAdRequest(adConfig.appOpenAdUnitId)

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
