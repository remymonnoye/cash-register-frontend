export async function onRequestPost(context) {
  const { results } = await context.env.cashregisterdb
    .prepare("INSERT INTO Boisson (nom, prix, categorie) VALUES (?, ?, ?)")
    .bind(context.request.body.nom, context.request.body.prix, context.request.body.categorie)
    .run();
  return Response.json(results);
}