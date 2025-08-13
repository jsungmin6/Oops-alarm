import React from 'react'
import { View } from 'react-native'
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads'

const unitId = 'ca-app-pub-2229465145229904/3161806144'

export default function AdBanner() {
  return (
    <View style={{ alignItems: 'center', marginBottom: 16 }}>
      <BannerAd unitId={unitId} size={BannerAdSize.BANNER} />
    </View>
  )
}
