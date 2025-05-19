import posts from "./post/data";

export async function onRequestGet(){
    const {results} = await context.env.cashregisterdb.prepare("SELECT * FROM Boisson").all();
    return Response.json(results)
}
