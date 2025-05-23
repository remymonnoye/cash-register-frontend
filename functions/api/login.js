import bcrypt from 'bcrypt';
import { generateJWT } from './services/jwt';

export async function onRequestPost(context){
    const {username, password} = await context.request.json();  

    const { results } = await context.env.cashregisterdb
    .prepare("SELECT * FROM Utilisateur WHERE nom = ?")
    .bind(username)
    .all();

    if (results.length === 0) {
        return new Response(JSON.stringify({error: "Utilisateur non trouvé"}), {status: 401});
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.motdepasse);
    if (!match) {
        return new Response(JSON.stringify({error: "Mot de passe incorrect"}), {status: 401});
    }

    const token = await generateJWT(user.id, user.nom, user.role);
    // Envoie le token au client
    return Response.json({success: true, username: user.nom, token});
}