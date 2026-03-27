# 광고 수정 플랜

## Phase 1 — iOS App Store 심사 통과 (필수, 즉시)

> 현재 App Open 광고가 개인화 요청을 하고 있고, ATT 관련 Info.plist 설정이 누락되어 있어 심사 거절 위험이 있음.

### 작업 항목

#### 1-1. `NSUserTrackingUsageDescription` 추가 (Info.plist)
- `ios/oopsalarm/Info.plist`에 아래 키 추가
```xml
<key>NSUserTrackingUsageDescription</key>
<string>앱 내 광고를 개선하기 위해 사용됩니다.</string>
```

#### 1-2. App Open 광고에 비개인화 옵션 추가
- `services/ads.ts` 53번 줄 수정
```ts
// 변경 전
AppOpenAd.createForAdRequest(adConfig.appOpenAdUnitId)

// 변경 후
AppOpenAd.createForAdRequest(adConfig.appOpenAdUnitId, {
    requestNonPersonalizedAdsOnly: true,
})
```

#### 1-3. Banner 빈 카드 노출 버그 수정
- `BannerAdSection.tsx`에 `onAdFailedToLoad` 처리 추가
- 광고 로딩 실패 시 카드 전체를 숨겨서 빈 초록 카드가 유저에게 보이지 않도록

### ✅ Phase 1 체크리스트

- [ ] `Info.plist`에 `NSUserTrackingUsageDescription` 키가 존재함
- [ ] App Open ad 생성 코드에 `requestNonPersonalizedAdsOnly: true` 옵션이 포함됨
- [ ] Banner 광고 로딩 실패 시 카드 전체(AD 뱃지 포함)가 화면에서 사라짐
- [ ] iOS 시뮬레이터 또는 실기기에서 앱 오픈 시 App Open 광고가 표시됨
- [ ] Banner 광고가 알람 목록 상단에 정상 표시됨
- [ ] 광고 로딩 실패 상황(비행기 모드 등)에서 빈 카드가 보이지 않음

---

## Phase 2 — Android 프로덕션 광고 연결

> 현재 Android 광고 ID가 전부 Google 테스트 ID라 실제 광고 수익이 발생하지 않음.

### 작업 항목

#### 2-1. AdMob 콘솔에서 Android 앱 등록 및 ID 발급
- AdMob 콘솔(admob.google.com) → 앱 추가 → Android
- 패키지명: `com.jsungmin506.oopsalarm`
- 발급 항목:
  - Android App ID (`ca-app-pub-xxxx~xxxx`)
  - Banner Ad Unit ID
  - App Open Ad Unit ID

#### 2-2. `app.json` Android App ID 교체
```json
// 변경 전
"androidAppId": "ca-app-pub-3940256099942544~3347511713"  // 테스트 ID

// 변경 후
"androidAppId": "ca-app-pub-발급받은실제ID"
```

#### 2-3. `services/ads.ts` Android 광고 유닛 ID 추가 및 연결
```ts
const ANDROID_APP_OPEN_AD_UNIT_ID = 'ca-app-pub-.../...'
const ANDROID_BANNER_AD_UNIT_ID = 'ca-app-pub-.../...'

// adConfig에서 Platform.select로 분기
appOpenAdUnitId: Platform.select({
    ios: IOS_APP_OPEN_AD_UNIT_ID,
    android: ANDROID_APP_OPEN_AD_UNIT_ID,
    default: TestIds.APP_OPEN,
}),
bannerAdUnitId: Platform.select({
    ios: IOS_BANNER_AD_UNIT_ID,
    android: ANDROID_BANNER_AD_UNIT_ID,
    default: TestIds.BANNER,
}),
```

#### 2-4. `USE_TEST_APP_OPEN_ADS` / `USE_TEST_NATIVE_ADS` 플래그 정리
- 개발/프로덕션 환경 분기를 `__DEV__` 기준으로 통일
```ts
const USE_TEST_ADS = __DEV__
```

### ✅ Phase 2 체크리스트

- [ ] AdMob 콘솔에서 Android 앱이 등록되어 있고 App ID가 발급됨
- [ ] Banner, App Open Android Ad Unit ID가 각각 발급됨
- [ ] `app.json`의 `androidAppId`가 실제 AdMob Android App ID로 교체됨
- [ ] `services/ads.ts`에 Android 광고 유닛 ID 상수가 정의됨
- [ ] `adConfig`에서 Android용 ad unit ID가 `Platform.select`로 올바르게 분기됨
- [ ] `USE_TEST_ADS` 플래그가 `__DEV__` 기준으로 동작함 (개발 빌드에서 테스트 광고, 프로덕션에서 실제 광고)
- [ ] Android 실기기 프로덕션 빌드에서 App Open 광고 노출 확인
- [ ] Android 실기기 프로덕션 빌드에서 Banner 광고 노출 확인
- [ ] AdMob 콘솔에서 Android 광고 요청/노출 수치가 올라오는 것 확인 (반영 최대 24시간)

---

## Phase 3 — NativeAdCard 정리 또는 활성화

> 현재 NativeAdCard가 구현되어 있으나 어디에도 사용되지 않음. 방치하거나 실제로 붙일지 결정 필요.

### 선택지 A — 사용 안 할 경우 (파일 삭제)
- `components/NativeAdCard.tsx` 삭제
- `services/ads.ts`에서 `IOS_NATIVE_AD_UNIT_ID`, `USE_TEST_NATIVE_ADS`, `nativeAdUnitId` 제거

### 선택지 B — 실제로 붙일 경우
- `USE_TEST_NATIVE_ADS = false` (또는 Phase 2에서 `__DEV__`로 통일됐으면 자동 처리)
- HomeScreen 등 적절한 위치에 `<NativeAdCard />` 삽입
- AdMob 콘솔에서 Native Ad Unit ID 활성화 상태 확인

### ✅ Phase 3 체크리스트 (선택지 A 기준)

- [ ] `NativeAdCard.tsx` 파일이 삭제됨
- [ ] `services/ads.ts`에서 Native 관련 상수와 `adConfig.nativeAdUnitId`, `adConfig.useTestAds`가 제거됨
- [ ] `adConfig.useTestAds`를 참조하는 다른 코드가 없음 (grep 확인)
- [ ] 빌드 에러 없음

---

## 진행 순서 요약

```
Phase 1 (지금 당장)
  → iOS 심사 제출 전 필수
  → 1-2시간 작업

Phase 2 (iOS 심사 중 병행 가능)
  → AdMob Android 앱 등록 후 진행
  → Android 빌드 준비 시점에 완료

Phase 3 (여유 있을 때)
  → NativeAdCard 방향 결정 후 처리
```
