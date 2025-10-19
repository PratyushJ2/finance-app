import { useAuth } from '../Context/AuthContext';
import { refreshAccessToken } from '../utils/refreshAccessToken';

export const useAuthenticatedFetch = () => {
    const {accessToken, setAccessToken, logout} = useAuth();

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

      // If token expired or invalid, try refresh
      if (res.status === 403 || res.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          setAccessToken(newToken);
          token = newToken;

          // Retry the original request
          return fetch(url, {
            ...options,
            headers: {
              ...(options.headers || {}),
              Authorization: `Bearer ${newToken}`,
            },
          });
        } else {
          // Couldn't refresh
          logout();
        }
      }

      return res;
    };

    return doFetch();
  };

  return authenticatedFetch;
}