module.exports = {
  getEnumChoiceList: (enumObject) => {
    const list = [];
    for (const key in enumObject) {
      list.push(enumObject[key]);
    }
    return list;
  }
}
