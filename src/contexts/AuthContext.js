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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Google OAuth 로그인 후 기존 user_metadata 보존
      if (event === 'SIGNED_IN' && session?.user) {
        // Google OAuth로 로그인한 경우 (app_metadata에 provider 정보가 있음)
        const isGoogleLogin = session.user.app_metadata?.provider === 'google';
        
        if (isGoogleLogin) {
          // 최신 user 정보 가져오기 (user_metadata 포함)
          const { data: { user: latestUser } } = await supabase.auth.getUser();
          
          if (latestUser?.user_metadata) {
            // 기존에 저장된 name, nickname, avatar_url이 있으면 보존
            const existingName = latestUser.user_metadata.name;
            const existingNickname = latestUser.user_metadata.nickname;
            const existingAvatarUrl = latestUser.user_metadata.avatar_url;
            
            // Google에서 가져온 정보와 병합 (기존 정보 우선)
            if (existingName || existingNickname || existingAvatarUrl) {
              const mergedMetadata = {
                ...latestUser.user_metadata,
                name: existingName || latestUser.user_metadata.name,
                nickname: existingNickname || latestUser.user_metadata.name,
                avatar_url: existingAvatarUrl || latestUser.user_metadata.avatar_url,
              };
              
              // 병합된 metadata로 업데이트
              await supabase.auth.updateUser({
                data: mergedMetadata
              });
              
              // 세션 새로고침
              const { data: { session: newSession } } = await supabase.auth.getSession();
              setUser(newSession?.user ?? null);
              setLoading(false);
              return;
            }
          }
        }
      }
      
      setUser(session?.user ?? null);
      setLoading(false);
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
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

