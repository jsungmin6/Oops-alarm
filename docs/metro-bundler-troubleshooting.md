# Metro 번들러 관련 트러블슈팅

## unsanitizedScriptURLString = (null) 에러

**증상:** 실기기에서 앱 실행 시 흰 화면과 함께 아래 에러 발생.
```
No script URL provided. Make sure the packager is running or you have embedded a JS bundle in your application bundle.
unsanitizedScriptURLString = (null)
```

**원인:** Debug 빌드는 JS 번들을 앱 안에 내장하지 않고, 실행 시 Metro 번들러에서 실시간으로 받아온다. Metro가 실행되지 않은 상태에서 Debug 빌드 앱을 열면 이 에러가 발생한다.

**해결 방법 1 — Release 빌드 사용 (권장)**
```bash
npx expo run:ios --device "00008110-0015259034BA801E" --configuration Release
```
JS 번들이 앱 안에 내장되어 Metro 없이 동작한다.

**해결 방법 2 — Metro 번들러 실행 후 Debug 앱 열기**
```bash
npx expo start
```
Metro가 뜬 상태에서 앱을 열면 정상 동작한다. 단, Mac과 iPhone이 같은 네트워크에 있어야 한다.

---

## Debug vs Release 빌드 차이

| 항목 | Debug | Release |
|---|---|---|
| JS 번들 | Metro에서 실시간 수신 | 앱 안에 내장 |
| Metro 필요 여부 | 필요 | 불필요 |
| `__DEV__` 값 | `true` | `false` |
| 광고 | 테스트 광고 | 프로덕션 광고 |
| 빌드 속도 | 빠름 | 느림 |
| 용도 | 개발/디버깅 | 실제 배포 테스트, 스크린샷 촬영 |
