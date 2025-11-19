# Google OAuth "MockAI" 에러 해결 가이드

## 문제 상황
모바일에서 Google 로그인 시 "MockAI's request does not comply with Google's policies" 에러가 발생합니다.

## 원인
1. **Supabase 프로젝트 이름이 "MockAI"로 설정되어 있음**
2. **Google Cloud Console의 OAuth 클라이언트 이름이 "MockAI"임**
3. **모바일 브라우저의 User-Agent가 Google 정책을 위반하는 것으로 인식됨**

## 해결 방법

### 1. Supabase 프로젝트 설정 확인 및 변경

1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. **Settings** → **General** 메뉴로 이동
4. **Project Name** 확인 및 변경
   - 현재 "MockAI"로 되어 있다면 "ChattyPay" 또는 "Wally"로 변경
5. 변경 사항 저장

### 2. Google Cloud Console 설정 확인

1. [Google Cloud Console](https://console.cloud.google.com)에 로그인
2. 프로젝트 선택
3. **APIs & Services** → **Credentials** 메뉴로 이동
4. OAuth 2.0 클라이언트 ID 확인
5. **Application name** 확인 및 변경
   - "MockAI"로 되어 있다면 "ChattyPay" 또는 "Wally"로 변경

### 3. OAuth 동의 화면 설정

1. Google Cloud Console에서 **APIs & Services** → **OAuth consent screen** 메뉴로 이동
2. **App name** 확인 및 변경
   - "MockAI"로 되어 있다면 "ChattyPay" 또는 "Wally"로 변경
3. **Authorized domains**에 배포된 도메인 추가:
   - `wally3v2.vercel.app`
   - (선택) 커스텀 도메인이 있다면 추가
4. 변경 사항 저장

### 4. Supabase Google OAuth 설정 확인

1. Supabase 대시보드 → **Authentication** → **Providers** 메뉴로 이동
2. **Google** 프로바이더 확인
3. **Client ID**와 **Client Secret**이 올바르게 설정되어 있는지 확인
4. **Authorized redirect URLs**에 다음이 포함되어 있는지 확인:
   - `https://wally3v2.vercel.app/**`
   - `https://[your-project-ref].supabase.co/auth/v1/callback`

### 5. 모바일 브라우저 문제 해결

에러 메시지에 "Use secure browsers" 정책 위반이 표시되는 경우:

1. **데스크톱 브라우저에서 테스트**: 먼저 데스크톱에서 정상 작동하는지 확인
2. **모바일에서 웹 브라우저 사용**: 앱 내 브라우저 대신 외부 브라우저(Chrome, Safari) 사용
3. **User-Agent 문제**: 코드에서 이미 수정했지만, 추가로 확인 필요

### 6. 추가 확인 사항

- [ ] Supabase 프로젝트 이름이 "MockAI"가 아님
- [ ] Google Cloud Console의 OAuth 클라이언트 이름이 올바름
- [ ] OAuth 동의 화면의 앱 이름이 올바름
- [ ] Authorized domains에 배포 도메인이 포함됨
- [ ] 리다이렉트 URI가 올바르게 설정됨

### 7. 테스트 방법

1. **데스크톱 브라우저에서 테스트**
   - Chrome 또는 Safari에서 `https://wally3v2.vercel.app` 접속
   - Google 로그인 버튼 클릭
   - 정상 작동하는지 확인

2. **모바일 브라우저에서 테스트**
   - 모바일 Chrome 또는 Safari에서 접속
   - Google 로그인 버튼 클릭
   - 정상 작동하는지 확인

3. **앱 내 브라우저에서 테스트**
   - 인앱 브라우저에서도 테스트
   - 문제가 계속되면 외부 브라우저 사용 권장

## 참고

- Google OAuth 정책: https://developers.google.com/identity/protocols/oauth2/policies
- Supabase Auth 문서: https://supabase.com/docs/guides/auth

