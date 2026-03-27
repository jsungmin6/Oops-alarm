# 광고 노출 관련 트러블슈팅

## AdMob BannerAd - display:none 사용 금지

**문제:** BannerAd를 감싼 View에 `display: 'none'`을 적용했더니 광고가 로드되지 않음.

**원인:** React Native에서 `display: 'none'`은 컴포넌트를 네이티브 뷰 계층(native view hierarchy)에서 완전히 제거한다. AdMob BannerAd는 네이티브 뷰에 붙어있어야 광고 요청을 시작하므로, `display: 'none'` 상태에서는 `onAdLoaded`가 영원히 호출되지 않는다.

**해결:** 광고 로드 전에는 `position: 'absolute', opacity: 0`으로 화면 밖에 숨겨두고, `onAdLoaded` 후 정상 카드 스타일로 전환.

```tsx
// ❌ 이렇게 하면 광고가 로드 안 됨
<View style={{ display: 'none' }}>
    <BannerAd ... />
</View>

// ✅ 이렇게 해야 로드됨
<View style={loaded ? styles.card : { position: 'absolute', opacity: 0 }}>
    <BannerAd ... />
</View>
```

---

## AdMob 프로덕션 광고는 앱 출시 전에 안 뜸

**문제:** Release 빌드에서 프로덕션 Ad Unit ID를 써도 광고가 뜨지 않음.

**원인:** AdMob 프로덕션 광고는 App Store/Google Play에 앱이 실제로 출시된 후에 서빙된다. 미출시 앱에는 광고 응답이 없음.

**해결:** 개발/테스트 빌드에서는 반드시 `TestIds`를 사용. `__DEV__` 플래그로 분기.

```ts
// 모든 광고 유닛에 __DEV__ 분기 적용
const USE_TEST_ADS = __DEV__
```

---

## iOS 앱 아이콘 알파 채널 제거

**문제:** EAS 제출 시 `Invalid large app icon - can't be transparent or contain an alpha channel` 에러.

**원인:** `assets/icon.png`만 바꿔도 소용없음. iOS 네이티브 프로젝트의 asset catalog에 별도 아이콘 파일이 있음.

**실제 파일 위치:**
```
ios/oopsalarm/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png
```

**해결:** sips로 JPEG 변환 후 PNG로 다시 저장해서 알파 채널 제거.
```bash
sips App-Icon-1024x1024@1x.png -s format jpeg --out /tmp/temp.jpg
sips /tmp/temp.jpg -s format png --out App-Icon-1024x1024@1x.png
```

---

## EAS Submit - ascAppId 필요

**문제:** `eas submit --non-interactive` 실패.

**원인:** `eas.json`의 submit 프로필에 `ascAppId`(App Store Connect 앱 ID)가 없으면 non-interactive 모드에서 실패.

**해결:** App Store Connect → 앱 정보 → Apple ID(숫자)를 `eas.json`에 추가.
```json
"submit": {
  "production": {
    "ios": {
      "ascAppId": "6761249131"
    }
  }
}
```
