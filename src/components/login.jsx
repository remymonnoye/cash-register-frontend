import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Appel à l'API d'authentification
    const resp = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (resp.ok) {
      // Stocke un token en localStorage (ou cookie)
      const { token } = await resp.json();
      localStorage.setItem("token", token);
      navigate("/");
    } else {
      setError("Identifiants invalides");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h5">Connexion</Typography>
      <TextField label="Utilisateur" value={username} onChange={e => setUsername(e.target.value)} sx={{ m: 1 }} />
      <TextField label="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} sx={{ m: 1 }} />
      <Button type="submit" variant="contained" sx={{ m: 1 }}>Se connecter</Button>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}