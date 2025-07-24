import React from "react"

export default function FileUpload(){

    function submitFolder(){
        // const key = 'ssssdekfnrvjnekfemfk'
        // const encoder= new TextEncoder();
        // // const data = encoder.encode()
        // const file = document.getElementById();
    }

    async function submitFile(){
        const key = await window.crypto.subtle.generateKey(
            {
                name:'AES-GCM',
                length: '256',
            },
            true,
            ["encrypt","decrypt"]
        )
        const exportedkey = await window.crypto.subtle.exportKey("raw",key)
        console.log(exportedkey);
    }

    return (
        <>
            <form >
                <label>Choose a File or Mutiple File</label>
                <input type="file"  className='border-1 p-4 m-4 hover:cursor-pointer' multiple/>
                <button type='button' onClick={submitFile} className='m-4'>Submit</button>
            </form>
            <form >
                <label>Upload a Folder</label>
                <input type="file"  className='border-1 p-4 m-4 hover:cursor-pointer' folder="true" />
                <button type='submit' onClick={submitFolder} className='m-4'>Submit</button>
            </form>
        </>
    )
}
