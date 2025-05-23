export async function onRequestPost(context) {
    const data = await context.request.json();
    const { nom, prix, categorie } = data;
  const  results  = await context.env.cashregisterdb
    .prepare("INSERT INTO Boisson (nom, prix, categorie) VALUES (?, ?, ?)")
    .bind(nom, prix, categorie)
    .run();
  return Response.json({success: true, id: results.lastRowId});
}