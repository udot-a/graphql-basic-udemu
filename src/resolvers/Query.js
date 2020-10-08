const Query = {

  comments: (parents, args, {db: {comments}}, info) => {
    if (args.query) {
      return comments.filter(c => c.text.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()));
    }
    return comments;
  },

  users: (parents, args, {db: {users}}, info) => {
    if (args.query) {
      return users.filter(u => u.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()));
    }
    return users;
  },

  posts: (parents, args, {db: {posts}}, info) => {
    if (args.query || args.query === false) {
      return posts.filter(p => p.published === args.query);
    }
    return posts;
  },

  me: () => ({
    id: "123456",
    name: "Dron",
    email: "u@ukr.net",
    age: 42
  }),

  post: () => ({
    id: "987898",
    title: "Post number One",
    body: "Some post text",
    published: true
  })
};

export {Query};
