# Vercel 자동 배포 문제 해결 가이드

## 🔍 문제 진단

자동 배포가 안 되는 경우 확인할 사항:

### 1. GitHub에 푸시되었는지 확인
```bash
git log origin/main -5
```
- 최신 커밋이 GitHub에 있는지 확인

### 2. Vercel Git 연결 확인
- Vercel Dashboard → Settings → Git
- Repository가 `suhhee1128-pixel/wally3`인지 확인
- Production Branch가 `main`인지 확인

### 3. GitHub Webhook 확인
- GitHub → Repository → Settings → Webhooks
- Vercel webhook이 있는지 확인
- Webhook이 실패했는지 확인 (빨간색 표시)

### 4. Vercel Deployments 확인
- Vercel Dashboard → Deployments
- 최근 배포가 "Initial commit"만 있는지 확인
- 새 커밋이 배포되지 않았는지 확인

## ✅ 해결 방법

### 방법 1: Git 연결 재설정 (가장 확실함)

1. **Vercel Dashboard → Settings → Git**
2. **"Disconnect" 클릭** (연결 해제)
3. **"Connect Git Repository" 클릭**
4. **GitHub에서 `suhhee1128-pixel/wally3` 선택**
5. **Production Branch: `main` 선택**
6. **"Deploy" 클릭**

### 방법 2: 수동 배포 (임시 해결)

```bash
# Vercel CLI로 직접 배포
npx vercel --prod
```

### 방법 3: GitHub Webhook 재생성

1. **GitHub → Repository → Settings → Webhooks**
2. **기존 Vercel webhook 삭제** (있다면)
3. **Vercel에서 Git 연결을 다시 설정하면 자동으로 생성됨**

## 🎯 확인 체크리스트

- [ ] GitHub에 최신 커밋이 푸시되어 있는지 확인
- [ ] Vercel Settings → Git에서 Repository 연결 확인
- [ ] Production Branch가 `main`인지 확인
- [ ] GitHub Webhooks에 Vercel webhook이 있는지 확인
- [ ] Vercel Deployments에서 최근 배포 확인

## 📝 다음 단계

1. **먼저 Git 연결 재설정 시도** (방법 1)
2. **그래도 안 되면 Vercel CLI로 배포** (방법 2)
3. **문제가 계속되면 Vercel 지원팀에 문의**




