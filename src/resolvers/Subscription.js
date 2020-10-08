const Subscription = {
  count: {
    subscribe: (parents, args, { pubsub }, info) => {
      let count = 0;

      setInterval(() => {
        count++;
        pubsub.publish("count", { count });
      }, 1000);
      return pubsub.asyncIterator("count");
    }
  },
  comment: {
    subscribe: (parents, { postId }, { pubsub }, info) => {
      return pubsub.asyncIterator(`comment by post ${postId}`);
    }
  },

  post: {
    subscribe: (parents, args, { pubsub }, info) => {
      return pubsub.asyncIterator("post");
    }
  }

};

export {Subscription};
