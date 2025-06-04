import { requireAuth} from "./services/auth";
export async function onRequestPost(context) {
  try {
        // Vérifie l'authentification de l'utilisateur
        const user = await requireAuth(context.request);
        const data = await context.request.json();
        const { nom, prix, categorie } = data;
        const  results  = await context.env.cashregisterdb
        .prepare("INSERT INTO Boisson (nom, prix, categorie) VALUES (?, ?, ?)")
        .bind(nom, prix, categorie)
        .run();
        return new Response("OK");
    }catch (e){
        return new Response(e.message,{status: e.message === "Forbidden" ? 403 : 401});
    }
}