import { useState, useEffect } from 'react'

export default function Home() {

    const [data, setData] = useState(null);
    const apiUrl = '/api';

    useEffect(()=>{
        fetch(`${apiUrl}/data`)
            .then((res) => res.json())
            .then((dataFromServer) => setData(dataFromServer))
    },[])

    return (
        <>
            <h1>Home</h1>
            <h2>{data && <p>{data.message}</p>}</h2>
        </>
    )
}



