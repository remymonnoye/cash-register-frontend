// This function is called when a GET request is made to the /api/posts endpoint²
export async function onRequestGet(context) {
  // Remplace "DB" par le nom de ton binding si besoin (ex: cashregisterdb)
  const { results } = await context.env.cashregisterdb
    .prepare("SELECT * FROM Boisson")
    .all();
  return Response.json(results);
}

export async function onRequestPost(context) {
  const { results } = await context.env.cashregisterdb
    .prepare("INSERT INTO Boisson (nom, prix, categorie) VALUES (?, ?, ?)")
    .bind(context.request.body.nom, context.request.body.prix, context.request.body.categorie)
    .run();
  return Response.json(results);
}