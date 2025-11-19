# Vercel 수동 배포 가이드 (자동 배포가 안 될 때)

## 문제
GitHub에 푸시해도 Vercel이 자동 배포를 시작하지 않습니다.

## 해결 방법: Vercel Dashboard에서 수동 배포

### 방법 1: Deploy 버튼 사용 (가장 확실)

1. **Vercel Dashboard 접속**
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
   - Framework Preset: "Create React App" (또는 자동 감지)
   - Root Directory: `./` (기본값)
   - Build Command: `CI=false npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
   - **"Deploy"** 클릭

### 방법 2: 최신 배포 재배포

1. **Deployments 탭에서**
   - 가장 최근 배포 찾기
   - 배포 항목 오른쪽 **"..."** (점 3개) 메뉴 클릭
   - **"Redeploy"** 선택
   - **"Redeploy"** 버튼 클릭

### 방법 3: Settings에서 Git 재연결

1. **Settings → Git 이동**
   - 왼쪽 메뉴에서 "Settings" 클릭
   - "Git" 섹션 클릭

2. **연결 확인**
   - Repository가 `Yeon430/wally3`인지 확인
   - Production Branch가 `main`인지 확인

3. **재연결 (필요 시)**
   - "Disconnect" 클릭
   - "Connect Git Repository" 클릭
   - GitHub에서 `Yeon430/wally3` 선택
   - Production Branch: `main` 선택
   - "Deploy" 클릭

## 배포 완료 후 확인

배포가 완료되면:
- Deployments 탭에서 최신 배포 확인
- Source가 최신 커밋 ("Force deploy latest Google Analytics changes")인지 확인
- 배포 상태가 "Ready"인지 확인
- `https://wally3.vercel.app` 접속하여 확인

## 자동 배포가 안 되는 원인

1. **GitHub Webhook 문제**
   - GitHub → Settings → Webhooks에서 Vercel webhook 확인
   - Webhook이 없거나 비활성화되어 있을 수 있음

2. **Vercel 권한 문제**
   - Vercel이 GitHub 저장소에 접근할 권한이 없을 수 있음
   - GitHub → Settings → Applications → Authorized OAuth Apps에서 Vercel 확인

3. **브랜치 설정 문제**
   - Vercel이 다른 브랜치를 감시하고 있을 수 있음
   - Settings → Git에서 Production Branch 확인

## 추천 순서

1. **먼저 방법 1 시도** (Deploy 버튼)
2. 없으면 **방법 2 시도** (Redeploy)
3. 그래도 안 되면 **방법 3 시도** (Git 재연결)



