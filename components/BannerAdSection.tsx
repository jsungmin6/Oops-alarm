import { StyleSheet, Text, View } from 'react-native'
import {
    BannerAd,
    BannerAdSize,
} from 'react-native-google-mobile-ads'
import { adConfig } from '../services/ads'

export default function BannerAdSection() {
    return (
        <View style={styles.card}>
            <View style={styles.badgeRow}>
                <Text style={styles.badge}>AD</Text>
                <Text style={styles.helper}>Sponsored</Text>
            </View>
            <BannerAd
                unitId={adConfig.bannerAdUnitId}
                size={BannerAdSize.BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 20,
        padding: 8,
        borderRadius: 16,
        backgroundColor: '#F8FFE8',
        borderColor: '#DCECC0',
        borderWidth: 1,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
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
