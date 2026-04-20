import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    BannerAd,
    BannerAdSize,
} from 'react-native-google-mobile-ads'
import { adConfig } from '../services/ads'

export default function BannerAdSection() {
    const [loaded, setLoaded] = useState(false)

    return (
        <View style={loaded ? styles.card : styles.preload}>
            <BannerAd
                unitId={adConfig.bannerAdUnitId}
                size={BannerAdSize.BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
                onAdLoaded={() => setLoaded(true)}
                onAdFailedToLoad={() => setLoaded(false)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    preload: {
        position: 'absolute',
        opacity: 0,
    },
    card: {
        marginBottom: 14,
        alignItems: 'center',
    },
})
