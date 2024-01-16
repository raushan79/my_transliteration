const cmd = require('node-cmd');

const transToEng = (hindiWord) => {
  return new Promise((resolve, reject) => {
    let command = `python3 eng_trans.py '${hindiWord}'`;
    // console.log(command);
    let { data, err, stderr } = cmd.runSync(command);
    if (err) {
      console.log(`Error in transliteration. Error : ${err}`);
      reject(err);
    } else {
      console.log(`Transliterate word : ${hindiWord} --> ${data}`);
      resolve(data.trim());
    }
  });
}


module.exports = {
  transToEng
}