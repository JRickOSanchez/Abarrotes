const fs = require('fs');
const yaml = require('js-yaml');

try {
  const fileContents = fs.readFileSync('Untitled-1.yml', 'utf8');
  const data = yaml.load(fileContents);
  console.log(data);
} catch (e) {
  console.log(e);
}