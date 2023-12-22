const fs = require("fs");
const http = require("http");
const url = require("url");

/////////////////////////////////////////////////////////////////////////////////////
//FILES

const prodData = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const prodObj = JSON.parse(prodData);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8",
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-cards.html`,
  "utf-8",
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8",
);

/////////////////////////////////////////////////////////////////////////////////////
// FILLING TEMPLATES

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%PRODUCT_IMAGE%}/g, product.image);
  output = output.replace(/{%PRODUCT_PRICE%}/g, product.price);
  output = output.replace(/{%PRODUCT_FROM%}/g, product.from);
  output = output.replace(/{%PRODUCT_NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%PRODUCT_QTY%}/g, product.quantity);
  output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description);
  output = output.replace(/{%PRODUCT_ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%PRODUCT_isORGANIC%}/g, "not-organic");
  return output;
};

/////////////////////////////////////////////////////////////////////////////////////
// SERVER
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //ROUTING
  if (pathname === "/" || pathname === "/overview") {
    //OVERVIEW
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = prodObj.map((e) => replaceTemplate(tempCard, e)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  } else if (pathname === "/product") {
    //PRODUCT
    const product = prodObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(output);
  } else {
    res.writeHead(400, { "Content-type": "text/html" });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
