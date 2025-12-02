import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        // 에러가 발생해도 loading을 false로 설정하여 앱이 계속 실행되도록 함
      }
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(err => {
      console.error('Exception getting session:', err);
      // 예외가 발생해도 loading을 false로 설정하여 앱이 계속 실행되도록 함
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] onAuthStateChange event:', event, 'hasSession:', !!session);
      
      // 먼저 사용자 설정하고 로딩 종료 (블로킹하지 않음)
      // 이렇게 하면 Google OAuth 처리가 느려도 앱이 멈추지 않음
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Google OAuth 처리는 백그라운드에서 비동기로 실행 (로딩을 블로킹하지 않음)
      if (event === 'SIGNED_IN' && session?.user) {
        const isGoogleLogin = session.user.app_metadata?.provider === 'google';
        
        if (isGoogleLogin) {
          // 비동기로 실행하되 로딩을 블로킹하지 않음
          (async () => {
            try {
              const { data: { user: latestUser } } = await supabase.auth.getUser();
              
              if (latestUser?.user_metadata) {
                const existingName = latestUser.user_metadata.name;
                const existingNickname = latestUser.user_metadata.nickname;
                const existingAvatarUrl = latestUser.user_metadata.avatar_url;
                
                if (existingName || existingNickname || existingAvatarUrl) {
                  const mergedMetadata = {
                    ...latestUser.user_metadata,
                    name: existingName || latestUser.user_metadata.name,
                    nickname: existingNickname || latestUser.user_metadata.name,
                    avatar_url: existingAvatarUrl || latestUser.user_metadata.avatar_url,
                  };
                  
                  await supabase.auth.updateUser({
                    data: mergedMetadata
                  });
                  
                  // 업데이트 후 사용자 정보 새로고침 (로딩 상태는 변경하지 않음)
                  const { data: { session: newSession } } = await supabase.auth.getSession();
                  if (newSession?.user) {
                    setUser(newSession.user);
                  }
                }
              }
            } catch (error) {
              console.error('[AuthContext] Error updating Google OAuth metadata:', error);
              // 에러가 발생해도 앱은 계속 실행됨 (이미 setLoading(false)가 호출됨)
            }
          })();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, name) => {
    try {
      console.log('Supabase signUp called with:', { email, name });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
            nickname: name || email.split('@')[0],
          }
        }
      });
      console.log('Supabase signUp response:', { data, error });
      return { data, error };
    } catch (err) {
      console.error('Supabase signUp exception:', err);
      return { data: null, error: err };
    }
  };

  const signIn = async (email, password) => {
    try {
      console.log('Supabase signIn called with:', { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('Supabase signIn response:', { data, error });
      return { data, error };
    } catch (err) {
      console.error('Supabase signIn exception:', err);
      return { data: null, error: err };
    }
  };

  const signInWithGoogle = async () => {
    try {
      // 모바일 인앱 브라우저 감지 (더 강화된 감지)
      const ua = navigator.userAgent || navigator.vendor || window.opera;
      const isInAppBrowser = 
        // iOS 인앱 브라우저
        (/iPhone|iPod|iPad/i.test(ua) && !/Safari/i.test(ua)) ||
        // Android 인앱 브라우저
        (/Android/i.test(ua) && /wv|\.0\.0\.0/i.test(ua)) ||
        // 기타 인앱 브라우저 패턴
        /FBAN|FBAV|Line|KakaoTalk|Instagram|Naver/i.test(ua) ||
        // WebView 감지
        (window.navigator.standalone === false || window.matchMedia('(display-mode: standalone)').matches === false && /iPhone|iPad|iPod/i.test(ua));
      
      if (isInAppBrowser) {
        // 인앱 브라우저인 경우 사용자에게 명확한 안내
        const useExternalBrowser = window.confirm(
          '인앱 브라우저에서는 Google 로그인이 제한됩니다.\n\n' +
          'Chrome 또는 Safari 앱을 열고 다음 주소로 접속해주세요:\n' +
          window.location.origin + '\n\n' +
          '외부 브라우저로 열까요?'
        );
        
        if (useExternalBrowser) {
          // 외부 브라우저로 열기 시도
          const redirectUrl = encodeURIComponent(window.location.origin);
          const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ydlmkmgwxinfbhqbdben.supabase.co';
          const authUrl = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`;
          
          // iOS의 경우 특별 처리
          if (/iPhone|iPad|iPod/i.test(ua)) {
            window.location.href = authUrl;
          } else {
            window.open(authUrl, '_system');
          }
        }
        return { data: null, error: { message: 'Please use external browser (Chrome or Safari)' } };
      }
      
      // 일반 브라우저인 경우 정상적으로 처리
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: false,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.error('Supabase Google sign-in exception:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

