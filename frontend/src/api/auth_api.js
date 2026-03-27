export async function sendLoginCredential(data){
    const status = await fetch(import.meta.env.VITE_BACKEND_URL+'/login',{
        method:'POST',
        body:JSON.stringify(data),
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        }
    })
    return status;
    console.log(status)
}

export async function sendSignInCredential(data){
    const status = await fetch(import.meta.env.VITE_BACKEND_URL+'/register',{
        method:'POST',
        body:JSON.stringify(data),
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        }
    })
    return status;
}