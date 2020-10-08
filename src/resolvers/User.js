import {getRelativeItems} from "../service";

const User =  {
  posts: getRelativeItems("posts", "author"),
  comments: getRelativeItems("comments", "author")
};

export {User};
