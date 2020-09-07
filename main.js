var express = require('express');
const { exec } = require("child_process");
const app = express()
const service = createService('C:\\D\\проекты\\NodeJS\\child_project_for_monitor_app\\main.js')


app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.get('/run', (req, res) => {
    // exec("node C:\\D\\проекты\\NodeJS\\child_project_for_monitor_app\\main.js",function (err,result) {
    //     if(err) console.log(err);
    //     else console.log(result);
    //     res.send('ok');
    // });
    service.compute(data, function(err, result) {
        // result available here
        if(err) console.log(err);
        else console.log(result);
        res.send('ok');
      })
})

let server = app.listen(0, () => {
    console.log(`http://localhost:${server.address().port}`)
})


