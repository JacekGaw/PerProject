import React from 'react';
import {useLoaderData, Navigate } from "react-router-dom";
import axios from 'axios';


const MainRoot: React.FC = () => {
    const data = useLoaderData() as [];
    if (data.length > 0) {
        return (
            <Navigate to="/login" />
        )
    }
    return (
        <Navigate to="start" />
    )
    
    return ( 
        <> 
            <h1>Hello</h1>
        </>
    );
}

export const loader = async (): Promise<[] | Error> => {
    try {
        const response = await axios.get("http://localhost:3002/api/company");
        return response.data?.companies || [];
        
    } catch (err) {
        console.log(err);
        throw new Response("Failed to load companies" + err, { status: 500 });
    }

}
 
export default MainRoot;