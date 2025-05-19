import posts from "./post/data";

export async function onRequestGet(){
    const {results} = await useContext.env.cashregisterdb.prepare("SELECT * FROM Boisson").all();
    return Response.json(results)
}
