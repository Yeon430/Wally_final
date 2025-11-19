# Google Analytics 태그 감지 문제 해결 가이드

## 문제: Google Analytics 태그 감지 도구가 태그를 인식하지 못함

### 가능한 원인

1. **SPA (Single Page Application) 특성**: React 앱은 클라이언트 사이드 렌더링을 사용하므로, Google Analytics 감지 도구가 초기 HTML만 확인하고 JavaScript로 동적으로 로드되는 스크립트를 인식하지 못할 수 있습니다.

2. **배포 캐시**: Vercel이나 브라우저 캐시로 인해 최신 코드가 반영되지 않았을 수 있습니다.

3. **환경 변수 미설정**: Vercel에 환경 변수가 설정되지 않았을 수 있습니다.

## 해결 방법

### 1단계: 배포된 사이트에서 실제로 작동하는지 확인

1. **브라우저 개발자 도구로 확인**:
   - `https://wally3.vercel.app` 접속
   - F12 키로 개발자 도구 열기
   - **Console** 탭에서 다음 메시지 확인:
     - `Google Analytics initialized: G-PEW2CSJ9GW`
   - **Network** 탭에서 다음 요청 확인:
     - `gtag/js?id=G-PEW2CSJ9GW` 요청이 있는지 확인

2. **페이지 소스 확인**:
   - 페이지에서 우클릭 → "페이지 소스 보기"
   - `gtag.js` 스크립트가 포함되어 있는지 확인
   - `G-PEW2CSJ9GW`가 포함되어 있는지 확인

### 2단계: Google Analytics 실시간 보고서 확인

**태그 감지 도구보다 실시간 보고서가 더 정확합니다:**

1. [Google Analytics](https://analytics.google.com/) 접속
2. **보고서** → **실시간** → **개요** 클릭
3. `https://wally3.vercel.app`를 새 탭에서 열기
4. 실시간 보고서에서 방문자 수가 증가하는지 확인
   - **1분 이내**에 데이터가 나타나야 합니다
   - 데이터가 나타나면 → **태그는 정상 작동 중입니다!** (감지 도구만 문제일 수 있음)

### 3단계: Vercel 환경 변수 확인

1. Vercel Dashboard → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 다음 환경 변수가 있는지 확인:
   - `REACT_APP_GA_MEASUREMENT_ID` = `G-PEW2CSJ9GW`
   - **Environment**: Production, Preview, Development 모두 선택되어 있는지 확인
4. 없으면 추가하고 **Redeploy** 실행

### 4단계: 배포 확인

1. Vercel Dashboard → **Deployments** 탭
2. 최신 배포가 성공했는지 확인
3. 최신 배포의 커밋 메시지가 "Add Google Analytics integration"인지 확인
4. 배포가 실패했다면 로그 확인

### 5단계: 브라우저 캐시 클리어

1. **시크릿 모드**에서 `https://wally3.vercel.app` 접속
2. 또는 브라우저 캐시 완전 삭제 후 다시 접속

## 확인 체크리스트

- [ ] `public/index.html`에 `gtag.js` 스크립트가 포함되어 있음
- [ ] Vercel에 `REACT_APP_GA_MEASUREMENT_ID` 환경 변수가 설정되어 있음
- [ ] 최신 코드가 Vercel에 배포되었음
- [ ] 브라우저 콘솔에 "Google Analytics initialized" 메시지가 나타남
- [ ] Network 탭에서 `gtag.js` 요청이 보임
- [ ] Google Analytics 실시간 보고서에 데이터가 나타남

## 중요 참고사항

**Google Analytics 태그 감지 도구는 때때로 SPA에서 작동하지 않을 수 있습니다.** 하지만 실제로는 태그가 정상 작동하고 있을 수 있습니다.

**가장 정확한 확인 방법은 Google Analytics 실시간 보고서입니다:**
- 실시간 보고서에 데이터가 나타나면 → 태그는 정상 작동 중입니다
- 실시간 보고서에 데이터가 없으면 → 태그가 작동하지 않는 것입니다

## 추가 디버깅

브라우저 콘솔에서 다음 명령어로 확인:

```javascript
// Google Analytics가 로드되었는지 확인
console.log(window.dataLayer);

// gtag 함수가 있는지 확인
console.log(typeof window.gtag);

// 측정 ID 확인
console.log(window.gtag && window.gtag('get', 'G-PEW2CSJ9GW', 'client_id'));
```

모두 정상이면 태그는 작동하고 있는 것입니다!



