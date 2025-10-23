import { useAuth } from '../Context/AuthContext';
import { refreshAccessToken } from '../utils/refreshAccessToken';

export const useAuthenticatedFetch = () => {
    const { accessToken, setAccessToken, logout } = useAuth();

    const authenticatedFetch = async (url, options = {}) => {
        let token = accessToken;

        const doFetch = async () => {
            const res = await fetch(url, {
                ...options,
                headers: {
                    ...(options.headers || {}),
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 403 || res.status === 401) {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    setAccessToken(newToken);
                    token = newToken;

                    return fetch(url, {
                        ...options,
                        headers: {
                            ...(options.headers || {}),
                            Authorization: `Bearer ${newToken}`,
                        },
                    });
                } else {
                    logout();
                }
            }

            return res;
        };

        return doFetch();
    }

    return authenticatedFetch;
};