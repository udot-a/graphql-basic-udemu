const getRelativeItems = (dataArray, field) => (parent, args, {db}, info) => db[dataArray].filter(item => item[field] === parent.id)

const getOneRelativeItem = (dataArray, field) => (parent, args, {db}, info) => db[dataArray].find(item => item.id === parent[field]);

export {
  getOneRelativeItem,
  getRelativeItems
};
