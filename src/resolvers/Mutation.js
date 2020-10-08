import {v4 as uuidv4} from "uuid";

const postPublish = (pubsub, mutation, post) =>
  pubsub.publish("post", {
    post: {
      mutation,
      data: post
    }
  });

const commentPublish = (pubsub, mutation, comment) =>
  pubsub.publish(`comment by post ${comment.post}`, {
    comment: {
      mutation,
      data: comment
    }
  });


const Mutation = {
  createUser: (parents, {data}, {db: {users}}, info) => {
    const {name, email, age} = data;
    const emailTaken = users.some(u => u.email === email);

    if (emailTaken) {
      throw new Error("Email taken.")
    }

    const user = {id: uuidv4(), name, email, age};

    users.push(user);

    return user;
  },

  deleteUser: (parents, {id}, {db}, info) => {
    const userIndex = db.users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      throw new Error("User not found.")
    }

    const [user] = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter(p => {
      const match = p.author === id;

      if (match) {
        db.comments = db.comments.filter(c => c.post !== p.id)
      }

      return !match;
    });

    db.comments = db.comments.filter(c => c.author !== id);

    return user;
  },

  updateUser: (parents, {id, data}, {db: {users}}, info) => {
    const user= users.find(u => u.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    if (data.email) {
      if (users.some(u => u.email === data.email)){
        throw new Error("Email taken.");
      }
    }

    for (let key in user) {
      if (data[key] || data[key] === false) {
        user[key] = data[key];
      }
    }

    return user;
  },

  createPost: (parents, {data}, {pubsub, db: {users, posts}}, info) => {
    const {title, body, published, author} = data;
    const userExists = users.some(u => u.id === author);

    if (!userExists) {
      throw new Error("User not found.")
    }

    const post = {
      id: uuidv4(),
      title,
      body,
      published,
      author
    };
    posts.push(post);

    if (post.published) {
      postPublish(pubsub, "CREATED", post);
      // pubsub.publish("post", {
      //   post: {
      //     mutation: "CREATED",
      //     data: post
      //   }
      // });
    }

    return post;
  },

  deletePost: (parents, {id}, {db, pubsub}, info) => {
    const postIndex = db.posts.findIndex(u => u.id === id);

    if (postIndex === -1) {
      throw new Error("Post not found.")
    }

    const [post] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter(c => c.post !== id);

    if (post.published) {
      postPublish(pubsub, "DELETED", post);
    }
    return post;
  },

  updatePost: (parents, {id, data}, {pubsub, db: {posts}}, info) => {
    const post= posts.find(p => p.id === id);
    const originPost = {...post};

    if (!post) {
      throw new Error("Post not found");
    }

    for (let key in post) {
      if (data[key] || data[key] === false) {
        post[key] = data[key];
      }
    }

    if (typeof data.published === "boolean") {
      if (originPost.published && !post.published) {
        postPublish(pubsub, "DELETED", originPost);
      } else if (!originPost.published && post.published) {
          postPublish(pubsub, "CREATED", originPost);
      }
    } else if (post.published) {
      postPublish(pubsub, "UPDATED", originPost);
    }



    return post;
  },

  createComment: (parents, {data}, {pubsub, db: {comments, users, posts}}, info) => {
    const {text, author, post} = data;
    const userExists = users.some(u => u.id === author);
    const postExists = posts.some(p => p.id === post && p.published);

    if (!userExists) {
      throw new Error("User not found.")
    }
    if (!postExists) {
      throw new Error("Post not found.")
    }

    const comment = {id: uuidv4(), text, author, post};

    comments.push(comment);

    commentPublish(pubsub, "CREATED", comment);

    return comment;
  },

  deleteComment: (parents, {id}, {pubsub, db}, info) => {
    const commentIndex = db.comments.findIndex(c => c.id === id);

    if (commentIndex === -1) {
      throw new Error("Comment not found.")
    }

    const [comment] = db.comments.splice(commentIndex, 1);

    commentPublish(pubsub, "DELETED", comment);

    return comment;
  },

  updateComment: (parents, {id, data}, {pubsub, db: {comments}}, info) => {
    const comment= comments.find(c => c.id === id);

    if (!comments) {
      throw new Error("Comment not found");
    }

    for (let key in comment) {
      if (data[key] || data[key] === false) {
        comment[key] = data[key];
      }
    }

    commentPublish(pubsub, "UPDATED", comment);

    return comment;
  }

};

export {Mutation};
