# Vercel Git 연결 및 자동 배포 설정 가이드

## 문제
Vercel이 GitHub 푸시를 감지하지 못하고 자동 배포가 작동하지 않습니다.

## 해결 방법

### 1단계: Git 저장소 연결 확인

1. **Vercel Dashboard → Settings → Git**
   - "Connected Git Repository" 섹션이 보이는지 확인
   - 보이지 않으면 → Git 저장소가 연결되지 않은 상태

2. **Git 저장소 연결**
   - "Connect Git Repository" 버튼 클릭
   - GitHub에서 `Yeon430/wally3` 선택
   - Production Branch: `main` 선택
   - "Import" 또는 "Deploy" 클릭

### 2단계: Build and Deployment 설정 확인

1. **Settings → Build and Deployment** 이동
   - Production Branch가 `main`으로 설정되어 있는지 확인
   - 아니면 `main`으로 변경하고 저장

2. **Build Command 확인**
   - `CI=false npm run build`로 설정되어 있는지 확인

3. **Output Directory 확인**
   - `build`로 설정되어 있는지 확인

### 3단계: GitHub Webhook 확인

1. **GitHub → `Yeon430/wally3` 저장소**
2. **Settings → Webhooks** 이동
3. **Vercel webhook 확인**
   - Vercel webhook이 있는지 확인
   - 없으면 Vercel이 푸시를 감지하지 못함
   - 있으면 webhook이 활성화되어 있는지 확인

### 4단계: 수동 배포로 테스트

Git 연결 후에도 자동 배포가 안 되면:

1. **Deployments 탭으로 이동**
2. **"Deploy" 버튼 클릭** (상단 오른쪽)
3. **"Deploy from GitHub" 선택**
4. **`Yeon430/wally3` 선택**
5. **Branch: `main` 선택**
6. **Deploy 클릭**

## 확인 체크리스트

- [ ] Git 저장소가 연결되어 있음 (`Yeon430/wally3`)
- [ ] Production Branch가 `main`으로 설정됨
- [ ] GitHub Webhook이 설정되어 있음
- [ ] Build Command가 올바르게 설정됨
- [ ] 수동 배포가 작동함

## 자동 배포가 여전히 안 되면

1. **GitHub → Settings → Applications → Authorized OAuth Apps**
   - Vercel이 권한을 가지고 있는지 확인
   - 없으면 Vercel Dashboard에서 다시 연결

2. **Vercel 프로젝트 삭제 후 재생성** (최후의 수단)
   - Settings → General → Delete Project
   - 새 프로젝트 생성 시 `Yeon430/wally3` 선택



