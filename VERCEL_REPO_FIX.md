# Vercel 저장소 연결 수정 가이드

## 문제
Vercel이 `Yeon430/wally3`를 감시하고 있지만, 실제 코드는 `suhhee1128-pixel/wally3`에 푸시되고 있습니다.

## 해결 방법

### 방법 1: Vercel에서 저장소 변경 (권장)

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. `wally3` 프로젝트 선택
3. **Settings** 탭 클릭
4. **Git** 섹션에서 **Disconnect** 클릭
5. **Connect Git Repository** 클릭
6. `suhhee1128-pixel/wally3` 저장소 선택
7. **Import** 클릭

이렇게 하면 앞으로 `suhhee1128-pixel/wally3`에 푸시할 때마다 자동으로 배포됩니다.

### 방법 2: 수동 재배포

1. Vercel Dashboard → `wally3` 프로젝트
2. **Deployments** 탭
3. 최신 배포 옆의 **...** 메뉴 클릭
4. **Redeploy** 선택

또는:

1. **Deployments** 탭
2. 상단의 **Deploy** 버튼 클릭
3. **Deploy from GitHub** 선택
4. `suhhee1128-pixel/wally3` 저장소 선택
5. `main` 브랜치 선택
6. **Deploy** 클릭

### 방법 3: GitHub 저장소 변경 (비권장)

만약 `Yeon430/wally3`를 계속 사용하고 싶다면:

```bash
git remote set-url origin https://github.com/Yeon430/wally3.git
git push origin main
```

하지만 이 경우 저장소가 바뀌므로 권장하지 않습니다.

## 확인 방법

배포가 성공하면:
- Vercel Dashboard의 Deployments 탭에서 최신 커밋 메시지 확인
- "Initialize Google Analytics in index.js for earlier execution" 커밋이 보이면 성공



