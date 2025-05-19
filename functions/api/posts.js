import posts from "./post/data";

export function onRequestget(){
    return Response.json(posts);
}
