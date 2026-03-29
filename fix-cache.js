const fs = require("fs");
const path = require("path");

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else {
      if (file.endsWith(".ts")) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walkDir(path.join(process.cwd(), "app", "api", "admin"));

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  if (content.includes('revalidateTag("')) {
    const newContent = content.replace(/revalidateTag\("([^"]+)",\s*"max"\)/g, 'revalidateTag("$1")');
    if (newContent !== content) {
      fs.writeFileSync(file, newContent, "utf8");
      console.log("Fixed:", file);
    }
  }
});
