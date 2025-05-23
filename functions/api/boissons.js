import {requireAuth} from "../services/auth.js";
// This function is called when a GET request is made to the /api/posts endpoint²
export async function onRequestGet(context) {
  try{
    const user = await requireAuth(context.request);
      const { results } = await context.env.cashregisterdb
        .prepare("SELECT * FROM Boisson")
        .all();
      return new Response("OK");
    }catch (e){
        return new Response(e.message,{status: e.message === "Forbidden" ? 403 : 401});
    }
}

