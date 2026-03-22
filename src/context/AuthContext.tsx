import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import AuthService, { AppUser } from '../services/AuthService';
// import { app, auth } from '../firebase/config';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import LoadingIndicator from '../components/LoadingIndicator';
import MainSplash from '../v1/shared/ui/Splash/MainSplash';



export interface AuthContextData {
  userData: AppUser | null;
  loading: boolean;
  googleSignIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      const startTime = Date.now();
      try {
        const bootstrappedUser = await AuthService.bootstrapAuth();
        setUserData(bootstrappedUser ?? null);
      } catch (err) {
        console.error('Bootstrap auth error:', err);
        setUserData(null);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(2000 - elapsed, 0);
        setTimeout(() => {
          setInitializing(false);
        }, remaining);
      }

      unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
        try {
          const appUser = await AuthService.handleAuthStatusChanged(firebaseUser);
          setUserData(appUser ?? null);
        } catch (err) {
          console.error('Auth state change error:', err);
          setUserData(null);
        }
      });
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const googleSignIn = async () => {
    try {
      setLoading(true);
      // save in server
      const response = await AuthService.signIn();
      setUserData(response as AppUser);

      // Alert.alert("Google Sign-In Success", "You have successfully signed in with Google");
      Toast.show({
        type: 'success',
        position: 'bottom',
        bottomOffset: 100,
        topOffset: 100,
        text1: 'Success ✅',
        text2: 'You have successfully signed in with Google',
        text1Style: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        text2Style: {
          fontSize: 14,
        },
      });
    } catch (err: any) {

      console.error('Google Sign-In Error:', err);
      Toast.show({
        type: 'error',
        position: 'bottom',
        bottomOffset: 100,
        topOffset: 100,
        text1: 'Error ❌',
        text2: err.message,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await AuthService.signOut();
      setUserData(null);
      Toast.show({
        type: 'success',
        position: 'bottom',
        bottomOffset: 100,
        topOffset: 100,
        text1: 'Success ✅',
        text2: 'Signed out successfully',
      });
    } catch (err: any) {
      console.error('Error:', err);
      Toast.show({
        type: 'error',
        position: 'bottom',
        bottomOffset: 100,
        topOffset: 100,
        text1: 'Error ❌',
        text2: err.message,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ userData, loading, googleSignIn, signOut }),
    [userData, loading]
  );

  if (initializing) {
    return <MainSplash />;
  }
  if (loading) {
    return <LoadingIndicator message="Loading..." />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
