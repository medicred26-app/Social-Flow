import { auth, googleProvider, signInWithPopup } from './firebase';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  idToken?: string;
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
  const loaded = await loadGoogleGsiScript();
  
  if (!loaded || !(window as any).google?.accounts) {
    // Fallback to Firebase Google Popup if GIS script fails to load
    return await signInWithFirebaseGoogle();
  }

  return new Promise((resolve, reject) => {
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
            console.warn('Google Token Client error, attempting Firebase fallback:', err);
            signInWithFirebaseGoogle().then(resolve).catch(reject);
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
          signInWithFirebaseGoogle().then(resolve).catch(reject);
        }
      });
    } catch (err) {
      console.warn('Google GIS popup failed, falling back to Firebase Auth:', err);
      signInWithFirebaseGoogle().then(resolve).catch(reject);
    }
  });
}

/**
 * Fallback Firebase Google Auth Popup
 */
export async function signInWithFirebaseGoogle(): Promise<GoogleUser> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  return {
    id: user.uid,
    email: user.email || '',
    name: user.displayName || 'Google User',
    picture: user.photoURL || undefined,
  };
}
