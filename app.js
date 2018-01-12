let fs = require('fs');
const http = require('http');
const WebApp = require('./webapp');
const appUtility = require('./appUtility.js');
let logRequest=appUtility.logRequest;
let getHeader=appUtility.getHeader;
let isFile=appUtility.isFile;
const dataBase = require('./data/dataBase.json');
let validUsers=[{name:'santosh',place:'karad'},{name:'vivek',place:'karad'}];


let serveStaticFile = function(req, res) {
  let path = req.url;
  if (path == '/') {
    res.redirect('/login.html');
  }
  let filePath='./public'+path;
  if (fs.existsSync(filePath)&&isFile(filePath)) {
    let data = fs.readFileSync('./public' + path);
    res.statusCode = 200;
    res.setHeader('Content-Type', getHeader(path));
    res.write(data);
    res.end();
    return;
  }
}

let serveFile = function(req, res) {
  if (req.method == "GET" && !req.url.startsWith('/Gu')) {
    serveStaticFile(req, res);
  }
}

let postLogin=(req, res) => {
  let user = validUsers.find(u => u.name == req.body.userName);
  req.user=req.body.userName;
  if (!user) {
    res.setHeader('Set-Cookie', `logInFailed=true`);
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', `sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/home.html');
};

let app = WebApp.create();
app.use(logRequest);
app.use(serveFile);
app.post('/login',postLogin)



module.exports=app;
