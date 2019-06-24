let getKeys = data => {
  console.log();
  var _keys = Object.keys(data);
  if (_keys != []) {
    _keys.forEach(key => {
      if (key == "0") {
        return;
      }
      console.log("workds for key", key);
      console.log("the contents->", data[key]);
      getKeys(data[key]);
      // console.log("item is", item);
    });
  } else {
    return 0;
  }
};
let maketree = (rootBranch: string, data: Object) => {
  console.log(data);
  getKeys(data);
  // let keys = getKeys(data);
  // // console.log(keys);
  // keys.forEach(key => {
  //   console.log("book is", key);
  //   console.log(data[key]);
  //   // var next_keys = getKeys(key);
  //   // next_keys.forEach(n_key => {
  //   //   getKeys(n_key);
  //   // });
  //   // console.log("book keys", getKeys(data[key]));
  // });
  let arrayFromObject = Object.entries(data);
  // console.log(arrayFromObject);
  // data.map(item => {
  //   console.log(item);
  //   var keys = getKeys(item);
  //   keys.forEach(key => {
  //     console.log(item.key);
  //   });
  // });
  // for (var i = 0; i < arrayFromObject.length; i++) {
  //   var branch = data[i];
  //   console.log(branch);
  //   console.log(getKeys(branch));
  // }
};
export default maketree;
