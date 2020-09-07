var express = require('express');
const { Worker } = require('worker_threads');
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
var apps = [];
var w = [];


function runService(workerData,app) {
  return new Promise((resolve, reject) => {
    var worker = new Worker(app, { workerData });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    })
    console.log(worker.threadId)
    apps.push({"ID":worker.threadId,"Application":workerData,"Location":app});
    w.push(worker);
  })
}

async function run(appname,loc) {
  const result = await runService(appname,loc)
  console.log(result);
}

app.get('/', (req, res) => {
    res.render(__dirname + '\\views\\login.ejs',{apps:apps});
});

app.get('/run',(req,res) => {
    run(req.query.appname,req.query.location).catch(err => console.error(err))
    res.render(__dirname + '\\views\\login.ejs',{apps:apps});
})

app.get('/terminate',(req,res) => {
    tid = req.query.thread
    var k=0;
    w.forEach(elem => {
        if(elem.threadId == tid){
            elem.terminate()
            apps.splice(k,1);
            w.splice(k,1);
        }
        k++;
    })
    res.render(__dirname + '\\views\\login.ejs',{apps:apps});
})

app.get('/reload',(req,res) =>{
    var appname,loc;
    tid = req.query.thread
    console.log(apps)
    var k = 0;
    apps.forEach(app => {
        if(app.ID == tid) {
            appname = app.Application;
            loc = app.Location;
            apps.splice(k,1)
        }
        k++;
    })
    run(appname,loc).catch(err => console.error(err))
    res.render(__dirname + '\\views\\login.ejs',{apps:apps});
});

let server = app.listen(8888, () => {
    console.log(`http://localhost:${server.address().port}`)
})
