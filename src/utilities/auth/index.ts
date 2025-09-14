const verifyTokenFromServer = async (token: string) => {
    // In browser, use relative paths
    if (typeof window !== 'undefined') {
        const response = await fetch('/api/auth/verify', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(token),
        });
        return response.json();
    }
    
    // On server, use absolute URL
    const baseUrl = process.env.NEXT_PUBLIC_HOST_URL;
    const url = baseUrl ? `${baseUrl}/api/auth/verify` : 'http://localhost:3000/api/auth/verify';

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(token),
    });
    return response.json();
};

export const getJwtSecretKey = () => {
    const key = process.env.JWT_SECRET_KEY;
    if (!key) throw new Error("No JWT secret key");
    return new TextEncoder().encode(key);
};

export const verifyJwtToken = async (token: string) => {
    const response = await verifyTokenFromServer(token);
    if (!response) return null;
    return response;
};
