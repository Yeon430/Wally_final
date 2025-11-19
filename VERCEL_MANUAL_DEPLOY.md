# Vercel 수동 배포 가이드

## 방법 1: 최신 배포 재배포 (가장 간단)

1. Vercel Dashboard → `wally3` 프로젝트
2. **Deployments** 탭
3. 가장 위에 있는 배포 (현재 "Current"로 표시된 것) 찾기
4. 배포 항목 오른쪽의 **"..."** (점 3개) 메뉴 클릭
5. **"Redeploy"** 선택
6. 확인

이렇게 하면 최신 코드로 재배포됩니다.

## 방법 2: Vercel CLI 사용

터미널에서:

```bash
# Vercel CLI 설치 (처음 한 번만)
npm install -g vercel

# 프로젝트 디렉토리에서
cd /Users/yeonwoo/PBL/FullStack/wally3

# Vercel 로그인 (처음 한 번만)
vercel login

# 배포
vercel --prod
```

## 방법 3: GitHub에서 Webhook 수동 트리거

1. GitHub → `Yeon430/wally3` 저장소
2. **Settings** → **Webhooks**
3. Vercel webhook 찾기
4. **Recent Deliveries** 탭에서 최신 webhook 클릭
5. **Redeliver** 클릭

## 방법 4: Git 커밋으로 트리거

빈 커밋을 하나 더 만들어서 푸시:

```bash
git commit --allow-empty -m "Force Vercel deployment"
git push yeon430 main
```

## 확인 방법

배포가 시작되면:
- Vercel Dashboard의 Deployments 탭에서 새 배포가 "Building" 상태로 나타남
- 약 1-2분 후 "Ready" 상태로 변경됨
- 배포 완료 후 `https://wally3.vercel.app`에서 확인



