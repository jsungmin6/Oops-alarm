import { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import {
    NativeAd,
    NativeAdView,
    NativeAsset,
    NativeAssetType,
} from 'react-native-google-mobile-ads'
import { adConfig } from '../services/ads'

export default function NativeAdCard() {
    const [nativeAd, setNativeAd] = useState<NativeAd | null>(null)

    useEffect(() => {
        let mounted = true
        let loadedAd: NativeAd | null = null

        const loadAd = async () => {
            try {
                const ad = await NativeAd.createForAdRequest(adConfig.nativeAdUnitId)
                loadedAd = ad
                if (mounted) {
                    setNativeAd(ad)
                } else {
                    ad.destroy()
                }
            } catch (error) {
                console.warn('Failed to load native ad', error)
            }
        }

        void loadAd()

        return () => {
            mounted = false
            loadedAd?.destroy()
        }
    }, [])

    if (!nativeAd) {
        return null
    }

    return (
        <NativeAdView nativeAd={nativeAd} style={styles.card}>
            <View style={styles.topRow}>
                <Text style={styles.badge}>AD</Text>
                <Text style={styles.helperText}>
                    {adConfig.useTestAds ? 'Test Ad' : 'Sponsored'}
                </Text>
            </View>

            <View style={styles.contentRow}>
                {nativeAd.icon ? (
                    <NativeAsset assetType={NativeAssetType.ICON}>
                        <Image
                            source={{ uri: nativeAd.icon.url }}
                            style={styles.icon}
                        />
                    </NativeAsset>
                ) : null}

                    <View style={styles.textColumn}>
                        <NativeAsset assetType={NativeAssetType.HEADLINE}>
                            <Text style={styles.headline} numberOfLines={1}>
                                {nativeAd.headline}
                            </Text>
                        </NativeAsset>

                        <NativeAsset assetType={NativeAssetType.BODY}>
                            <Text style={styles.body} numberOfLines={1}>
                                {nativeAd.body}
                            </Text>
                        </NativeAsset>
                    </View>
                </View>

            <View style={styles.bottomRow}>
                <View style={styles.metaWrap}>
                    {nativeAd.advertiser ? (
                        <NativeAsset assetType={NativeAssetType.ADVERTISER}>
                            <Text style={styles.advertiser} numberOfLines={1}>
                                {nativeAd.advertiser}
                            </Text>
                        </NativeAsset>
                    ) : nativeAd.store ? (
                        <NativeAsset assetType={NativeAssetType.STORE}>
                            <Text style={styles.advertiser} numberOfLines={1}>
                                {nativeAd.store}
                            </Text>
                        </NativeAsset>
                    ) : (
                        <Text style={styles.advertiser} numberOfLines={1}>
                            Google Ads
                        </Text>
                    )}
                </View>
                <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                    <Text style={styles.cta}>
                        {nativeAd.callToAction || 'Open'}
                    </Text>
                </NativeAsset>
            </View>
        </NativeAdView>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        padding: 12,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#DCECC0',
        backgroundColor: '#F8FFE8',
        shadowColor: '#A4C65A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 16,
        elevation: 3,
    },
    topRow: {
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
        overflow: 'hidden',
    },
    helperText: {
        marginLeft: 8,
        color: '#6D8F3C',
        fontSize: 12,
        fontFamily: 'Jua-Regular',
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        marginRight: 10,
        backgroundColor: '#FFFFFF',
    },
    textColumn: {
        flex: 1,
    },
    headline: {
        fontSize: 15,
        color: '#2F4216',
        fontFamily: 'Jua-Regular',
    },
    body: {
        marginTop: 2,
        fontSize: 12,
        lineHeight: 16,
        color: '#5C7144',
        fontFamily: 'Jua-Regular',
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    metaWrap: {
        flex: 1,
        marginRight: 10,
    },
    advertiser: {
        color: '#5B6A44',
        fontSize: 11,
        fontFamily: 'Jua-Regular',
    },
    cta: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: '#7CC34B',
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'Jua-Regular',
        overflow: 'hidden',
    },
})
