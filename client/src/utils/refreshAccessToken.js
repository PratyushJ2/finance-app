export const refreshAccessToken = async () => {
    try {
        const res = await fetch('/refresh-token', {
            method: 'POST',
            credientials: 'include'
        });

        if(!res.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await res.json();
        return data.accessToken;
    } catch (error) {
        console.error('Token refresh error', error);
        return null;
    }
};