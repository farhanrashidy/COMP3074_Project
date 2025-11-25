// this hook provides authentication and session management
// it is triggered in SignInPage.jsx when the user submits their email and password to sign in
// it communicates with EXPO_API_URL to authenticate the server and retrieve a token
// it then stores the session details in local storage for future use
// it does not itself call any functions from compproject_api/

import { useState } from 'react';

const AUTH_ENDPOINT = `$(process.env.EXPO_PUBLIC_API_URL)/api/auth` || '';
const TOKEN_KEY = 'auth_token';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const setSession = async (userData, authToken) => {}

    const getSession = async () => {}

    const clearSession = async () => {}

    const signIn = async (email, password) => {
        try {
            const response = await fetch(`${AUTH_ENDPOINT}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                return { message: 'Sign-in failed', error: data };
            }

            await setSession(data.user, data.token);
        } catch (error) {
            return { message: 'Sign-in failed', error };
        }
    }
}