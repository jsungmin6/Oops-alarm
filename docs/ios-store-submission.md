# iOS App Store 제출 작업 정리

## 1. 사전 준비

### Apple Developer 계정
- Apple Developer Program 가입 및 결제 완료
- App Store Connect 사용권 계약 동의

### AdMob 계정
- Google AdMob 계정 생성 및 승인 완료
- 결제 프로필 등록 완료
- iOS 광고 유닛 (App Open, Banner) 생성 완료

---

## 2. 코드 수정 (Phase 1)

### Info.plist
- `NSUserTrackingUsageDescription` 추가 (ATT 대응)
- `ITSAppUsesNonExemptEncryption` = false 추가 (수출 규정 문서 면제)
- `GADApplicationIdentifier` 확인 (기존 설정)

### services/ads.ts
- App Open 광고에 `requestNonPersonalizedAdsOnly: true` 추가
- `USE_TEST_APP_OPEN_ADS`, `USE_TEST_NATIVE_ADS` → `__DEV__` 기준으로 통일
- `bannerAdUnitId` `__DEV__` 분기 추가 (누락되어 있었음)

### components/BannerAdSection.tsx
- 광고 로드 전 빈 카드 노출 버그 수정
- `display: none` 대신 `position: absolute, opacity: 0` 방식으로 변경
- `onAdLoaded` / `onAdFailedToLoad` 콜백 추가

### screens/HomeScreen.tsx
- 테스트 안내 문구 `__DEV__` 조건부 렌더링으로 변경

### assets/icon.png + iOS asset catalog
- 앱 아이콘 알파 채널 제거 (Apple 심사 요건)
- `ios/oopsalarm/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png` 수정

---

## 3. App Store Connect 앱 등록

- 번들 ID: `com.jsungmin506.oopsalarm`
- Apple ID: `6761249131`
- SKU: `oopsalarm001`

---

## 4. EAS 빌드 및 제출

### eas.json 설정
- `submit.production.ios.ascAppId` = `6761249131` 추가

### 빌드 히스토리
| 빌드 | 결과 | 원인 |
|---|---|---|
| Build 3 | 실패 | 앱 아이콘 알파 채널 |
| Build 4 | 완료 | 아이콘 수정 / 수출 규정 문서 누락 경고 |
| Build 5 | 완료 | `ITSAppUsesNonExemptEncryption` 추가 후 정상 |

### 제출 명령어
```bash
eas build --platform ios --profile production
eas submit --platform ios --profile production --latest
```

---

## 5. App Store Connect 메타데이터

| 항목 | 내용 |
|---|---|
| 앱 이름 | Oops Alarm |
| 부제 | 주기 관리, 때 되면 알려드려요 |
| 카테고리 | 유틸리티 |
| 가격 | 무료 |
| 버전 | 1.0 |
| 저작권 | 2026 Taemin Kim |
| 지원 이메일 | jsungmin6@naver.com |
| 개인정보 처리방침 URL | https://ink-possum-716.notion.site/Oops-Alarm-33026587772c8048b4a1fc313b3c54c9 |

### 스크린샷
- iPhone 6.5": iPhone 16 Plus 시뮬레이터 (1290×2796 → 1284×2778 리사이즈)
- iPad 13": iPad Pro 13인치 시뮬레이터 (2064×2752)
- 배너 광고 숨기고 촬영 후 되돌림

---

## 6. 앱이 수집하는 개인정보

| 데이터 유형 | 용도 | 신원 연결 | 추적 |
|---|---|---|---|
| 기기 ID | 타사 광고 (AdMob) | 아니오 | 예 |
| 제품 상호 작용 | 광고 | 아니오 | 아니오 |
| 광고 데이터 | 광고 | 아니오 | 아니오 |

---

## 7. 심사 제출 후 해야 할 일

- [ ] 심사 통과 후 AdMob → 앱 → App Store URL 연결
- [ ] Android Phase 2 진행 (AdMob Android 앱 등록, Ad Unit ID 발급)
