# Vercel Analytics에서 사용자 정보 확인 방법

## 📊 Vercel Analytics 데이터 확인

### 1. Analytics 탭 접속

1. **Vercel Dashboard 접속**
   - https://vercel.com/yeonwoos-projects-d44e7542/wally3

2. **Analytics 탭 클릭**
   - 왼쪽 메뉴에서 **"Analytics"** 클릭

3. **확인할 수 있는 정보:**
   - **Visitors** (방문자 수)
   - **Page Views** (페이지뷰)
   - **Bounce Rate** (이탈률)
   - **Top Pages** (인기 페이지)
   - **Top Referrers** (유입 경로)
   - **Devices** (디바이스별 통계)
   - **Browsers** (브라우저별 통계)
   - **Countries** (국가별 통계)

### 2. 상세 데이터 확인

**Analytics 탭에서:**
- 날짜 범위 선택 (최근 7일, 30일 등)
- 그래프로 트렌드 확인
- 테이블로 상세 데이터 확인

### 3. 페이지별 분석

- **Top Pages** 섹션에서:
  - 어떤 페이지를 많이 보는지 확인
  - 각 페이지의 페이지뷰 수 확인
  - 사용자가 어디를 많이 방문하는지 확인

## ⚠️ 제한사항

### Vercel Analytics로는 볼 수 없는 것:
- ❌ 사용자가 정확히 어디를 클릭했는지 (Heatmap)
- ❌ 사용자의 세션 녹화
- ❌ 개별 사용자 추적
- ❌ 사용자 플로우 시각화

### 볼 수 있는 것:
- ✅ 전체 페이지뷰 수
- ✅ 인기 페이지
- ✅ 디바이스/브라우저 통계
- ✅ 국가별 통계

## 🔍 더 자세한 사용자 행동 분석이 필요하면

### Google Analytics 추가 (추천)

더 자세한 정보를 보려면 Google Analytics를 추가해야 합니다:

1. **Google Analytics 계정 생성**
   - https://analytics.google.com

2. **React 앱에 추가**
   ```bash
   npm install react-ga4
   ```

3. **코드에 추가** (App.js)
   ```javascript
   import ReactGA from 'react-ga4';
   
   ReactGA.initialize('G-XXXXXXXXXX');
   ReactGA.send({ hitType: "pageview", page: window.location.pathname });
   ```

### Google Analytics에서 볼 수 있는 것:
- ✅ 사용자가 어디를 클릭했는지 (이벤트 추적)
- ✅ 사용자 플로우 (어디서 들어와서 어디로 가는지)
- ✅ 세션 기록
- ✅ 실시간 사용자 활동

## 📝 요약

**Vercel Analytics에서:**
- Analytics 탭 → 페이지뷰, 방문자 수, 인기 페이지 등 확인

**더 자세한 정보가 필요하면:**
- Google Analytics 추가 필요




