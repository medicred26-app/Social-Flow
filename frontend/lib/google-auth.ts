import { auth, googleProvider, signInWithPopup } from './firebase';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  idToken?: string;
}

// Mutex to prevent concurrent popup requests (fixes cancelled-popup-request & popup-blocked)
let isPopupInProgress = false;

/**
 * Checks if Firebase is configured with real credentials (not mock/placeholder)
 */
function isFirebaseProperlyConfigured(): boolean {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '';
  // If key is missing, empty, or contains obvious placeholder text, Firebase auth won't work
  if (!apiKey || apiKey.includes('Mock') || apiKey.includes('your-') || apiKey === 'AIzaSyMockKeyForSocialFlowDevelopment123') {
    return false;
  }
  return true;
}

/**
 * Dynamically loads the official Google Identity Services (GIS) JS SDK
 */
export function loadGoogleGsiScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).google?.accounts) return resolve(true);

    const existingScript = document.getElementById('google-gsi-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/**
 * Triggers Google OAuth 2.0 Account Chooser Popup Window
 */
export async function triggerGoogleSignInPopup(clientId: string): Promise<GoogleUser> {
  // Prevent concurrent popup requests
  if (isPopupInProgress) {
    throw new Error('A Google Sign-In popup is already in progress. Please wait.');
  }

  isPopupInProgress = true;

  try {
    const loaded = await loadGoogleGsiScript();

    if (!loaded || !(window as any).google?.accounts) {
      // Only fallback to Firebase if it's properly configured
      if (isFirebaseProperlyConfigured()) {
        return await signInWithFirebaseGoogle();
      }
      throw new Error('Google Sign-In SDK failed to load. Please check your internet connection and try again.');
    }

    return await new Promise<GoogleUser>((resolve, reject) => {
      try {
        // 1. Try OAuth 2.0 Token Client Popup (accounts.google.com popup window)
        if ((window as any).google.accounts.oauth2) {
          const client = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
            callback: async (tokenResponse: any) => {
              if (tokenResponse.access_token) {
                try {
                  // Fetch authenticated user profile from Google UserInfo API
                  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                  });
                  const info = await res.json();
                  resolve({
                    id: info.sub || `google_${Date.now()}`,
                    email: info.email,
                    name: info.name || info.given_name || 'Google User',
                    picture: info.picture,
                    idToken: tokenResponse.access_token,
                  });
                } catch (e) {
                  reject(e);
                }
              } else {
                reject(new Error('Google authorization token request cancelled or failed.'));
              }
            },
            error_callback: (err: any) => {
              // Don't cascade into Firebase popup — reject cleanly instead
              console.warn('Google Token Client error:', err);
              reject(new Error('Google Sign-In was cancelled or blocked by the browser. Please allow popups and try again.'));
            }
          });

          client.requestAccessToken();
          return;
        }

        // 2. Fallback to One Tap / ID Token flow if oauth2 token client unavailable
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            if (response.credential) {
              try {
                const base64Url = response.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(atob(base64));
                resolve({
                  id: payload.sub || `google_${Date.now()}`,
                  email: payload.email,
                  name: payload.name || 'Google User',
                  picture: payload.picture,
                  idToken: response.credential,
                });
              } catch (e) {
                reject(e);
              }
            } else {
              reject(new Error('No credential returned from Google Auth'));
            }
          },
        });

        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Only fallback to Firebase if properly configured — don't cascade otherwise
            if (isFirebaseProperlyConfigured()) {
              signInWithFirebaseGoogle().then(resolve).catch(reject);
            } else {
              reject(new Error('Google Sign-In prompt was not displayed. Please allow popups or try again.'));
            }
          }
        });
      } catch (err) {
        console.warn('Google GIS popup failed:', err);
        reject(err);
      }
    });
  } finally {
    isPopupInProgress = false;
  }
}

/**
 * Fallback Firebase Google Auth Popup — only call when Firebase is properly configured
 */
export async function signInWithFirebaseGoogle(): Promise<GoogleUser> {
  if (!isFirebaseProperlyConfigured()) {
    throw new Error(
      'Firebase is not configured with valid credentials. ' +
      'Please set NEXT_PUBLIC_FIREBASE_API_KEY and other Firebase env variables in frontend/.env.local'
    );
  }

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  return {
    id: user.uid,
    email: user.email || '',
    name: user.displayName || 'Google User',
    picture: user.photoURL || undefined,
  };
}
