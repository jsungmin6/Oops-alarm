# Android 배포 작업 정리

> iOS 심사 통과 후 진행 예정

---

## 1. AdMob Android 앱 등록

- admob.google.com → 앱 추가 → Android
- 패키지명: `com.jsungmin506.oopsalarm`
- 발급 필요한 항목:
  - Android App ID (`ca-app-pub-xxxx~xxxx`)
  - App Open Ad Unit ID (`ca-app-pub-xxxx/xxxx`)
  - Banner Ad Unit ID (`ca-app-pub-xxxx/xxxx`)

---

## 2. 코드 수정

### app.json
```json
// 변경 전 (테스트 ID)
"androidAppId": "ca-app-pub-3940256099942544~3347511713"

// 변경 후 (실제 ID)
"androidAppId": "ca-app-pub-발급받은ID"
```

### services/ads.ts
```ts
// 추가할 상수
const ANDROID_APP_OPEN_AD_UNIT_ID = 'ca-app-pub-.../...'
const ANDROID_BANNER_AD_UNIT_ID = 'ca-app-pub-.../...'

// adConfig 수정
appOpenAdUnitId: __DEV__
    ? TestIds.APP_OPEN
    : Platform.select({
        ios: IOS_APP_OPEN_AD_UNIT_ID,
        android: ANDROID_APP_OPEN_AD_UNIT_ID,
        default: TestIds.APP_OPEN,
    }),

bannerAdUnitId: __DEV__
    ? TestIds.BANNER
    : Platform.select({
        ios: IOS_BANNER_AD_UNIT_ID,
        android: ANDROID_BANNER_AD_UNIT_ID,
        default: TestIds.BANNER,
    }),
```

---

## 3. Google Play Console 앱 등록

- play.google.com/console 접속
- 앱 만들기
  - 앱 이름: `Oops Alarm`
  - 기본 언어: 한국어
  - 앱 유형: 앱
  - 무료/유료: 무료
- 패키지명: `com.jsungmin506.oopsalarm`

---

## 4. EAS 빌드 및 제출

```bash
eas build --platform android --profile production
eas submit --platform android --profile production --latest
```

### eas.json android submit 설정 필요
```json
"submit": {
  "production": {
    "ios": {
      "ascAppId": "6761249131"
    },
    "android": {
      "serviceAccountKeyPath": "./google-service-account.json"
    }
  }
}
```
- Google Play API 서비스 계정 키 발급 필요

---

## 5. Google Play 메타데이터

iOS App Store에서 작성한 내용 그대로 사용 가능:
- 앱 설명
- 키워드 (태그)
- 스크린샷 (Android 기기 기준 별도 촬영 필요)
- 개인정보 처리방침 URL: `https://ink-possum-716.notion.site/Oops-Alarm-33026587772c8048b4a1fc313b3c54c9`

---

## 6. 제출 후 해야 할 일

- [ ] AdMob → Android 앱 → Google Play URL 연결
- [ ] Play Console에서 앱 출시 확인
- [ ] 광고 노출 수치 확인 (반영까지 최대 24시간)
