import posts from "./data";

export function onRequestget(){
    return Response.json(posts);
}
