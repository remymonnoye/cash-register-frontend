import React, { useEffect, useState } from "react";

const boissons = () => {
  const [boissons, setboissons] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getboissons = async () => {
      try{
      const resp = await fetch("/api/boissons",{cache: "no-store",headers: {"Authorization": `Bearer ${localStorage.getItem("token")}` }});
      if (resp.status !== 200) {
        setError("Failed to fetch boissons");
        setLoading(false);
        return;
      }
      
      const boissonsResp = await resp.json();
      if(!boissonsResp || boissonsResp.length === 0) {
        setError("No boissons found");
        setLoading(false);
        return;
      }
      setboissons(boissonsResp);
      }catch (error) {
        console.error("Error fetching boissons:", error);
        setError("An error occurred while fetching boissons");
      }finally {
        setLoading(false);
      }
    };

    getboissons();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div>
      <h1>boissons</h1>
      {boissons.map((boisson) => (
       <div key={boisson.id}>
          <h2>
            {boisson.nom}
            {boisson.prix} €
            {boisson.categorie}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default boissons;