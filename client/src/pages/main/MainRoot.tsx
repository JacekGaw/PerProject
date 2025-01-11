/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { useLoaderData, Navigate } from "react-router-dom";
import axios from "axios";

const MainRoot: React.FC = () => {
  const data = useLoaderData() as [];
  if (data.length > 0) {
    return <Navigate to="/login" />;
  }
  return <Navigate to="/start" />;
};

export const loader = async (): Promise<[] | Error> => {
  try {
    const response = await axios.get("/api/company");
    return response.data?.companies || [];
  } catch (err) {
    throw new Response("Failed to load companies" + err, { status: 500 });
  }
};

export default MainRoot;
