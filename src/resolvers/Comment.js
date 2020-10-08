import {getOneRelativeItem} from "../service";

const Comment = {
  author: getOneRelativeItem("users", "author"),
  post: getOneRelativeItem("posts", "post")
};

export {Comment};
