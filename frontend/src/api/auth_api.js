export async function sendLoginCredential(data) {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include', // ✅ fixed
        headers: {
            "Content-Type": "application/json" // ✅ important
        }
    });

    return response;
}


export async function sendSignInCredential(data) {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include', // ✅ keep consistent
        headers: {
            "Content-Type": "application/json" // ✅ fixed
        }
    });

    return response;
}