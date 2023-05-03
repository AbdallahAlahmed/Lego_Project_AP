const express = require('express');
const app = express();
const ejs = require('ejs');




app.set("view engine", "ejs");
app.set("port", 3000);

app.get('/', (req: any, res: any) => {
    res.render('index')
});
app.get('/home', (req: any, res: any) => {
    res.render('home')
});
app.get('/bekijk', (req: any, res: any) => {
    res.render('bekijk')
});
app.get('/ordenen', (req: any, res: any) => {
    res.render('ordenen')
});
app.get('/blacklist', (req: any, res: any) => {
    res.render('blacklist')
});
app.get('/login', (req: any, res: any) => {
    res.render('login')
});




app.listen(app.get('port'),
    () => console.log('[server] http://localhost:' + app.get('port')));
