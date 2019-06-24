let getTree = (object, intent) => {
  var structure = "";
  if (typeof object === "object") {
    for (var key in object) {
      structure += " ".repeat(intent) + "|----- " + key + "\n";
      var value = object[key];
      if (typeof value === "object") {
        structure += getTree(value, intent + 4) + "\n";
      }
    }
  }
  return structure;
};

export default getTree;
