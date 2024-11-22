const http = require("node:http");
const url = require("node:url");
const { ResData } = require("./lib/resData");
const { Repository } = require("./lib/repository");
const path = require("node:path");
const { bodyParser } = require("./lib/bodyParser");
const { CategoryEntity } = require("./lib/categoryEntity");

const categoryDir = path.join(__dirname, "database", "categories.json");
const categoryRepo = new Repository(categoryDir);

async function handleRequest(req, res) {
  const method = req.method;
  const parsedUrl = url.parse(req.url).pathname.split("/");

  if (method === "GET" && parsedUrl[1] === "category") {
    const getAllData = await categoryRepo.read();

    const resData = new ResData(200, "success", getAllData);

    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));
  } else if (method === "POST" && parsedUrl[1] === "category") {
    const body = await bodyParser(req);

    if (!body.name) {
      const resData = new ResData(400, "Please provide a name");
      res.writeHead(resData.statusCode);
      return res.end(JSON.stringify(resData));
    }

    const newCategory = new CategoryEntity(body.name);

    await categoryRepo.writeNewData(newCategory);

    const resData = new ResData(201, "created", newCategory);

    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));
  } else if (method === "DELETE" && parsedUrl[1] === "category" && parsedUrl[2]) {
    const id = parsedUrl[2];
    const data = await categoryRepo.read();

    const itemIndex = data.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      const resData = new ResData(404, "No object found with the given ID");
      res.writeHead(resData.statusCode);
      return res.end(JSON.stringify(resData));
    }

    data.splice(itemIndex, 1);
    await categoryRepo.write(data);

    const resData = new ResData(200, "Deleted successfully");
    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));
  }else if(method==="PUT"&&parsedUrl[1]==="category"&&parsedUrl[2]){
    const id = parsedUrl[2];
    const body = await bodyParser(req); 

    if (!body.name) {
      const resData = new ResData(400, "Please provide valid ID to edit");
      res.writeHead(resData.statusCode);
      return res.end(JSON.stringify(resData));
    }

    const data = await categoryRepo.read();
    const itemIndex = data.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      const resData = new ResData(404, "No object found with the given ID");
      res.writeHead(resData.statusCode);
      return res.end(JSON.stringify(resData));
    }

    const item = data[itemIndex];

  
    if (body.name) item.name = body.name;

    await categoryRepo.write(data);

    const resData = new ResData(200, "Updated successfully", item);
    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));
  }else {
    const resData = new ResData(404, "This API does not exist");

    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));
  }
}

const server = http.createServer(handleRequest);

server.listen(7777, () => {
  console.log("http://localhost:7777");
});
