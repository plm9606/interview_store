const fs = require("fs");
const { get } = require("http");
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
  if (!row.startsWith("#")) continue;

  if (row.startsWith("### ")) {
    contentList.push(`    ${getContentLink(3)}`);
  } else if (row.startsWith("## ")) {
    contentList.push(`  ${getContentLink(2)}`);
  } else if (row.startsWith("# ")) {
    contentList.push(`${getContentLink(1)}`);
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

function getContentLink(sliceCnt) {
  row = row.slice(sliceCnt);
  const title = row.replace(/\#/g, "").trim();
  const link = title.toLowerCase().replace(/\(|\)/g, "").replace(/ /g, "-");
  return `- [${title}](#${link})`;
}
