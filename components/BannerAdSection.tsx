import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
    BannerAd,
    BannerAdSize,
} from 'react-native-google-mobile-ads'
import { adConfig } from '../services/ads'

export default function BannerAdSection() {
    const [loaded, setLoaded] = useState(false)

    return (
        <View style={loaded ? styles.card : styles.preload}>
            {loaded && (
                <View style={styles.badgeRow}>
                    <Text style={styles.badge}>AD</Text>
                    <Text style={styles.helper}>Sponsored</Text>
                </View>
            )}
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
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: '#F8FFE8',
        borderColor: '#DCECC0',
        borderWidth: 2,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#DDEFA8',
        color: '#466621',
        fontSize: 11,
        fontFamily: 'Jua-Regular',
    },
    helper: {
        marginLeft: 8,
        color: '#6D8F3C',
        fontSize: 12,
        fontFamily: 'Jua-Regular',
    },
})
