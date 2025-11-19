-# Deploy Hook으로 최신 커밋 배포하기

## 방법: Deploy Hook 생성 및 사용

### 1단계: Deploy Hook 생성

1. **Vercel Dashboard → `wally3` 프로젝트**
2. **Settings → Git** 이동
3. **"Deploy Hooks"** 섹션 찾기
4. **"Name"** 입력: `manual-deploy`
5. **"Branch"** 입력: `main`
6. **"Create Hook"** 버튼 클릭
7. **Hook URL이 생성됨** (예: `https://api.vercel.com/v1/integrations/deploy/...`)

### 2단계: Hook URL로 배포 트리거

생성된 Hook URL을 브라우저에서 열거나 curl로 호출:

**브라우저에서:**
1. Hook URL 복사
2. 새 탭에서 URL 열기
3. 배포가 시작됨!

**또는 터미널에서:**
```bash
curl -X POST "HOOK_URL_HERE"
```

### 3단계: 배포 확인

1. **Deployments 탭**으로 이동
2. 새 배포가 시작되었는지 확인
3. 최신 커밋 (`e3dd478`)으로 배포되는지 확인

---

## 더 간단한 방법: GitHub에서 Webhook 수동 트리거

### 1단계: GitHub Webhook 확인

1. **GitHub → `Yeon430/wally3` 저장소**
2. **Settings → Webhooks** 이동
3. **Vercel webhook 찾기**
4. **"Recent Deliveries"** 탭 클릭

### 2단계: Webhook 수동 트리거

1. 가장 최근 webhook 클릭
2. **"Redeliver"** 버튼 클릭
3. Vercel이 배포를 시작함

---

## 가장 확실한 방법: 빈 커밋 + Webhook

1. 빈 커밋 하나 더 만들기
2. GitHub webhook이 자동으로 트리거됨
3. Vercel이 배포 시작

이 방법을 시도해볼까요?



