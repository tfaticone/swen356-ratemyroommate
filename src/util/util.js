// Import database so that it gets initialized

export default {
  sortObject(obj) {
    const sortable = [];
    Object.keys(obj).forEach((key) => {
      sortable.push([key, obj[key]]);
    });
    sortable.sort((a, b) => {
      return a[1] - b[1];
    });
    return sortable.reverse();
  },
};
