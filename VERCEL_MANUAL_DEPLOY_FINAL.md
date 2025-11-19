# Vercel 수동 배포 최종 가이드

## Production Branch를 찾을 수 없을 때

Vercel의 UI가 업데이트되면서 Production Branch 설정이 다른 곳에 있거나 자동으로 `main` 브랜치를 사용할 수 있습니다.

## 해결 방법: 수동 배포

### 단계별 방법

1. **Vercel Dashboard → `wally3` 프로젝트**
   - https://vercel.com/dashboard
   - `wally3` 프로젝트 선택

2. **Deployments 탭으로 이동**
   - 왼쪽 메뉴에서 "Deployments" 클릭

3. **수동 배포 시작**
   - 상단 오른쪽에 **"Deploy"** 버튼이 있어야 합니다
   - 없으면 → 아래 방법 2 사용

4. **배포 설정**
   - "Deploy" 버튼 클릭
   - "Deploy from GitHub" 선택
   - `Yeon430/wally3` 저장소 선택
   - Branch: `main` 선택
   - Framework Preset: "Create React App" (자동 감지)
   - Build Command: `CI=false npm run build` (Override 켜고 입력)
   - Output Directory: `build`
   - **"Deploy"** 클릭

### 방법 2: 최신 배포 재배포

1. **Deployments 탭에서**
   - 가장 최근 배포 찾기
   - 배포 항목 오른쪽 **"..."** (점 3개) 메뉴 클릭
   - **"Redeploy"** 선택
   - **"Redeploy"** 버튼 클릭

## 배포 완료 후 확인

배포가 완료되면:
- Deployments 탭에서 최신 배포 확인
- Source가 최신 커밋 ("Test auto-deploy after Git reconnection")인지 확인
- 배포 상태가 "Ready"인지 확인
- `https://wally3.vercel.app` 접속하여 확인

## Google Analytics 확인

배포 완료 후:
1. `https://wally3.vercel.app` 접속
2. 개발자 도구 → Network 탭
3. 필터에 `gtag` 입력
4. `gtag/js?id=G-PEW2CSJ9GW` 요청이 보이는지 확인

## 자동 배포가 안 되는 이유

Vercel이 GitHub webhook을 받지 못하고 있을 수 있습니다:
- GitHub → Settings → Webhooks에서 Vercel webhook 확인
- Webhook이 없거나 비활성화되어 있을 수 있음

하지만 수동 배포로도 충분히 작동합니다!



