const fs = require("fs");
const filePath = process.argv[3];
const TITLE = "**💌CONTENTS**";

let text = fs.readFileSync(filePath).toString().split("\n");

if (text[0].startsWith(TITLE)) {
  let sliceCnt = -1,
    enterCnt = 2;
  while (enterCnt > 0 && sliceCnt < text.length) {
    sliceCnt++;
    if (text[sliceCnt] == "\r") enterCnt--;
  }
  text = text.slice(sliceCnt + 1);
}

const contentList = [TITLE, "\r"];
for (row of text) {
  if (row.startsWith("###")) {
    row = row.slice(3);
    const title = row.replace(/\#/g, "").trim();
    const link = title.toLowerCase().replace(/\(|\)/g, "").replace(/ /g, "-");
    contentList.push(`  - [${title}](#${link})`);
  } else if (row.startsWith("##")) {
    row = row.slice(2);
    const title = row.replace(/\#/g, "").trim();
    const link = title.toLowerCase().replace(/\(|\)/g, "").replace(/ /g, "-");
    contentList.push(`- [${title}](#${link})`);
  }
}
contentList.push("\r");
console.log(contentList);

const stream = fs.createWriteStream(filePath);
stream.on("error", (err) => {
  console.log(err);
});
contentList.concat(text).forEach((line) => {
  stream.write(line + "\n");
});
