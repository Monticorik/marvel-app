import { useState, useCallback } from "react";

const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', headers = {'Content-Type': 'application/json'}, body = null) => {
        
        setLoading(true);
        
        try{
            const responce = await fetch(url, {method, headers, body});

            if(!responce.ok){
                throw new Error(`Could not fetch ${url}, status: ${responce.status}`);
            }

            const data = await responce.json();

            setLoading(false);
            return data;
        } catch(e){
            setLoading(false);
            setError(e.message);
            throw e;
        }
        
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {loading, error, request, clearError};
}

export default useHttp;