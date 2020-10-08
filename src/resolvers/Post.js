import {getOneRelativeItem, getRelativeItems} from "../service";

const Post = {
  author: getOneRelativeItem("users", "author"),
  comments: getRelativeItems("comments", "post")
};

export {Post};
