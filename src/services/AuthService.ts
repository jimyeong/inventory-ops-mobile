import { apiClient, setHeader, ServiceResponse } from './ApiService';
import auth, { signInWithCredential } from '@react-native-firebase/auth';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  GoogleSignin,
  SignInSuccessResponse,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

// AsyncStorage keys
const REFRESH_TOKEN_KEY = '@auth/refresh_token';
const TOKEN_EXPIRY_KEY = '@auth/token_expiry';

export interface FirebaseUser extends FirebaseAuthTypes.User {
  role?: string;
  createdAt?: number;
}

export interface AppUser extends FirebaseUser {
  payload: {
    displayName: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    phoneNumber: string | null;
    photoURL: string | null;
    providerId: string;
    uid: string;
    createdAt?: string;
    loginAt?: string;
  };
  idToken: string;
}

interface SigninResponse extends SignInSuccessResponse {
  idToken?: string;
}

interface BackendAuthResponse {
  refresh_token: string;
  expires_in: number;
  user?: any;
}

interface RefreshTokenResponse {
  custom_token: string;
  refresh_token: string;
  expires_in: number;
}

class AuthService {
  private currentUser: AppUser | null = null;
  private GoogleSignin: typeof GoogleSignin;

  constructor() {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_WEB_CLIENT_ID,
      scopes: ['email', 'profile'],
      forceCodeForRefreshToken: true,
      iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
    });

    this.GoogleSignin = GoogleSignin;
  }

  async signIn(): Promise<AppUser> {

    try {
      const hasPlayServices = await this.GoogleSignin.hasPlayServices();
      if (!hasPlayServices) {
        throw new Error('Google Play Services are not installed on your device');
      }

      const result = (await this.GoogleSignin.signIn()) as SigninResponse & {
        type?: string;
        data?: {
          idToken?: string;
        };
      };

      const type = result?.type;
      if (type && type !== 'success') {
        throw new Error('Google sign-in was not successful');
      }

      const idToken = result?.data?.idToken ?? result?.idToken;
      if (!idToken) {
        throw new Error('Failed to get ID token from Google');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth(), googleCredential);
      const firebaseIdToken = await userCredential.user.getIdToken();

      await this.updateUserData(userCredential.user as AppUser, firebaseIdToken);

      const firebaseUser = userCredential.user as any;
      this.currentUser = {
        ...firebaseUser,
        payload: {
          ...firebaseUser._user,
        },
        idToken: firebaseIdToken,
      } as AppUser;

      setHeader(firebaseIdToken);
      console.log('**signIn complete');
      console.log('firebase currentUser uid:', auth().currentUser?.uid);
      console.log('currentUser exists:', !!this.currentUser);
      console.log('currentUser idToken exists:', !!this.currentUser?.idToken);
      console.log('stored refresh token:', await this.getRefreshToken());
      console.log('stored expiry:', await AsyncStorage.getItem(TOKEN_EXPIRY_KEY));
      return this.currentUser;
    } catch (err) {
      console.error('Google Authentication Error:', err);
      throw err;
    }
  }

  async updateUserData(user: AppUser, idToken: string) {
    setHeader(idToken);

    const response = await apiClient.post<ServiceResponse<BackendAuthResponse>>(
      '/public/api/v1/auth/signin',
      {
        user,
        idToken,
      },
    );

    if (response.data?.payload?.refresh_token) {
      await this.storeRefreshToken(response.data.payload.refresh_token);

      const expiryTime = Date.now() + response.data.payload.expires_in * 1000;
      await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

      const durationInDays = response.data.payload.expires_in / 86400;
      console.log(`Session will last for ${durationInDays.toFixed(1)} days`);
      console.log(`Session expires at: ${new Date(expiryTime).toLocaleString()}`);
    }

    return response.data;
  }

  async storeRefreshToken(refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Error storing refresh token:', error);
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving refresh token:', error);
      return null;
    }
  }

  async clearRefreshToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      await AsyncStorage.removeItem(TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('Error clearing refresh token:', error);
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await this.getRefreshToken();

      if (!refreshToken) {
        console.log('No refresh token available');
        return null;
      }

      console.log('Refreshing token...');

      const response = await apiClient.post<ServiceResponse<RefreshTokenResponse>>(
        '/public/api/v1/auth/refresh',
        {
          refresh_token: refreshToken,
        },
      );

      if (!response.data?.payload) {
        return null;
      }

      const {
        custom_token,
        refresh_token: newRefreshToken,
        expires_in,
      } = response.data.payload;

      await this.storeRefreshToken(newRefreshToken);

      const expiryTime = Date.now() + expires_in * 1000;
      await AsyncStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

      await auth().signInWithCustomToken(custom_token);

      const firebaseUser = auth().currentUser;
      if (!firebaseUser) {
        throw new Error('Firebase user not available after token refresh');
      }

      const firebaseIdToken = await firebaseUser.getIdToken();
      setHeader(firebaseIdToken);

      this.currentUser = {
        ...(firebaseUser as any),
        payload: {
          ...(firebaseUser as any)._user,
        },
        idToken: firebaseIdToken,
      } as AppUser;

      console.log('Token refreshed successfully');
      return firebaseIdToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      await this.clearRefreshToken();
      this.currentUser = null;
      setHeader('');
      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      const refreshToken = await this.getRefreshToken();

      if (refreshToken) {
        try {
          await apiClient.post('/public/api/v1/auth/revoke', {
            refresh_token: refreshToken,
          });
        } catch (revokeError) {
          console.error('Failed to revoke refresh token:', revokeError);
        }
      }

      await this.clearRefreshToken();
      await auth().signOut();

      try {
        await GoogleSignin.signOut();
      } catch (googleSignOutError) {
        console.error('Google signOut failed:', googleSignOutError);
      }
      try {
        const hasPreviousSignIn = await GoogleSignin.hasPreviousSignIn();
        if (hasPreviousSignIn) {
          await GoogleSignin.revokeAccess();
        }
      } catch (googleRevokeError) {
        console.error('Google revokeAccess failed:', googleRevokeError);
      }

      setHeader('');
      this.currentUser = null;
    } catch (error) {
      console.error('Sign Out Error:', error);
      this.currentUser = null;
      throw error;
    }
  }

  getCurrentUser(): AppUser | null {
    return this.currentUser;
  }

  async isAuthenticated(): Promise<boolean> {
    const firebaseUser = auth().currentUser;
    if (firebaseUser) {
      return true;
    }

    const refreshToken = await this.getRefreshToken();
    return !!refreshToken;
  }

  handleAuthStatusChanged = async (
    firebaseUser: FirebaseAuthTypes.User | null,
  ): Promise<AppUser | null> => {
    if (!firebaseUser) {
      this.currentUser = null;
      return null;
    }

    const firebaseIdToken = await firebaseUser.getIdToken();
    setHeader(firebaseIdToken);

    this.currentUser = {
      ...(firebaseUser as any),
      payload: {
        ...(firebaseUser as any)._user,
      },
      idToken: firebaseIdToken,
    } as AppUser;

    return this.currentUser;
  }
  async bootstrapAuth(): Promise<AppUser | null> {
    const firebaseUser = auth().currentUser;

    if (firebaseUser) {
      return this.handleAuthStatusChanged(firebaseUser);
    }

    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      this.currentUser = null;
      setHeader('');
      return null;
    }

    const refreshedIdToken = await this.refreshToken();
    if (!refreshedIdToken) {
      this.currentUser = null;
      setHeader('');
      return null;
    }

    const restoredFirebaseUser = auth().currentUser;
    if (!restoredFirebaseUser) {
      this.currentUser = null;
      setHeader('');
      return null;
    }

    return this.handleAuthStatusChanged(restoredFirebaseUser);
  }
  async isRefreshTokenExpired(): Promise<boolean> {
    const expiryTime = await AsyncStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) {
      return true;
    }
    return Date.now() > parseInt(expiryTime);
  }
}

export default new AuthService();