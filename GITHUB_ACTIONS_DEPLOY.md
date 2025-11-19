# GitHub Actions로 Vercel 배포 설정하기

## 문제
Vercel의 자동 배포가 작동하지 않아서 GitHub Actions를 사용합니다.

## 설정 방법

### 1단계: Vercel 토큰 생성

1. **Vercel Dashboard → Settings → Tokens**
   - https://vercel.com/account/tokens
2. **"Create Token"** 클릭
3. **Token Name**: `github-actions-deploy` 입력
4. **Scope**: `Full Account` 선택
5. **"Create"** 클릭
6. **토큰 복사** (한 번만 보여줌!)

### 2단계: Vercel 프로젝트 정보 확인

1. **Vercel Dashboard → `wally3` 프로젝트**
2. **Settings → General** 이동
3. **Project ID** 복사 (예: `prj_Py1r3jczyGalNZvpV8XjccWsAcB1`)

### 3단계: Vercel Organization ID 확인

1. Vercel Dashboard URL에서 확인:
   - URL: `vercel.com/yeonwoos-projects-d44e7542/...`
   - Organization ID: `yeonwoos-projects-d44e7542` (URL에서 확인)

또는:

1. **Vercel Dashboard → Settings → General**
2. **Team ID** 또는 **Organization ID** 확인

### 4단계: GitHub Secrets 설정

1. **GitHub → `Yeon430/wally3` 저장소**
2. **Settings → Secrets and variables → Actions** 이동
3. **"New repository secret"** 클릭

#### Secret 1: VERCEL_TOKEN
- **Name**: `VERCEL_TOKEN`
- **Value**: (1단계에서 생성한 토큰)
- **"Add secret"** 클릭

#### Secret 2: VERCEL_ORG_ID
- **Name**: `VERCEL_ORG_ID`
- **Value**: `yeonwoos-projects-d44e7542` (또는 확인한 Organization ID)
- **"Add secret"** 클릭

#### Secret 3: VERCEL_PROJECT_ID
- **Name**: `VERCEL_PROJECT_ID`
- **Value**: (2단계에서 확인한 Project ID)
- **"Add secret"** 클릭

### 5단계: GitHub Actions 실행

1. **GitHub → `Yeon430/wally3` → Actions 탭**
2. **"Deploy to Vercel"** 워크플로우 확인
3. 빈 커밋 푸시:
   ```bash
   git commit --allow-empty -m "Trigger GitHub Actions deploy"
   git push yeon430 main
   ```
4. **Actions 탭**에서 워크플로우 실행 확인
5. 배포 완료 대기 (약 1-2분)

## 확인 방법

1. **GitHub → Actions 탭**
   - 워크플로우가 실행되고 있는지 확인
   - "Deploy to Vercel" 작업이 성공하는지 확인

2. **Vercel Dashboard → Deployments**
   - 새 배포가 생성되었는지 확인
   - 최신 커밋으로 배포되었는지 확인

## 앞으로

이제 `main` 브랜치에 푸시할 때마다:
1. GitHub Actions가 자동으로 실행됨
2. Vercel에 자동으로 배포됨
3. 최신 코드가 항상 반영됨

## 문제 해결

### GitHub Actions가 실행되지 않으면
- `.github/workflows/deploy.yml` 파일이 올바른지 확인
- GitHub Secrets가 올바르게 설정되었는지 확인

### 배포가 실패하면
- Vercel 토큰이 유효한지 확인
- Project ID와 Organization ID가 올바른지 확인
- GitHub Actions 로그에서 에러 확인



