import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

function AddDrink() {
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [categorie, setCategorie] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const drinkData = {
      nom,
      prix,
      categorie
    };

    fetch('/api/boissons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(drinkData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        // Optionally, reset the form or show a success message
        alert('Boisson ajoutée avec succès');
        setNom('');
        setPrix('');
        setCategorie('');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Ajouter Boisson
      </Typography>
      <TextField
        label="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        variant="outlined"
      />
      <TextField
        label="Prix"
        value={prix} 
        onChange={(e) => setPrix(e.target.value)}
        variant="outlined"
      />
      <TextField
        label="Catégorie"
        value={categorie}
        onChange={(e) => setCategorie(e.target.value)}
        variant="outlined"
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Ajouter Boisson
      </Button>
    </Box>
  );
}

export default AddDrink;