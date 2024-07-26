// import the module
const recipeScraper = require("recipe-scraper");
const fs = require("fs");
const readline = require('readline');
const path = require('path');

const dirPath = path.join(__dirname, 'recipes');

fs.mkdir(dirPath, { recursive: true }, (err) => {
  if (err) {
    return console.error(`Error creating directory: ${err.message}`);
  }
  console.log('Directory created successfully');
});

String.prototype.hashCode = function () {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const scraper = async (url) => {
  recipeScraper(url).then(recipe => {
    const fileName = `${recipe.name}_${url.hashCode()}`;
    recipe.instructions = recipe.instructions.join(' ');
    fs.writeFile(path.join(__dirname, 'recipes', `${fileName}.json}`), JSON.stringify(recipe), (error) => {
      if (error) {
        console.log(error.message);
        throw error;
      }
    });
  }).catch(error => {
    console.log(error.message || error.msg);
  });
};

const readLines = async (filePath) => {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const url = line.trim();
    if (url) {
      await scraper(url)
    }
  }
};

readLines( path.join(__dirname, 'urls.txt'));
