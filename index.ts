

const express = require('express');
const app = express();
const ejs = require('ejs');
const axios = require('axios');





app.set("view engine", "ejs");
app.set("port", 3000);
app.use(express.static('public'))



import { MongoClient } from "mongodb";
interface LegoFigs {
    values: {
        figId: string,
        figUrlg: string,
        setId: string,
        setUrl: string
    }
}



const uri = "mongodb+srv://UserLego:UserTeamLego@lego.u2sfsfn.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
let main = async () => {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("Connected to database")

        // Make the appropriate DB calls
        //...

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        console.log("Database Disconnected")
    }
}
main();

app.get('/', (req: any, res: any) => {
    res.render('index')
});
app.get('/home', (req: any, res: any) => {
    res.render('home')
});
app.get('/bekijk', (req: any, res: any) => {

    const legoApi = async () => {

        let response = await axios.get(`https://rebrickable.com/api/v3/lego/minifigs/fig-000005/sets/?key=1940e6fc5741fb5fccb8643f3c735fd1`)
        let data = response.data.results;
        console.log(data[0].name)
        res.render('bekijk', { data: data })
    };

    legoApi();
});
app.get('/ordenen', (req: any, res: any) => {

    const legoApi = async () => {

        let id: string = "";
        const Randomizer = (): string => {
            let randomIndex: number = Math.floor(Math.random() * 13147);
            if (randomIndex < 10) {
                id = "fig-00000" + randomIndex;
            } else if (randomIndex > 10 && randomIndex < 100) {
                id = "fig-0000" + randomIndex;
            } else if (randomIndex > 100 && randomIndex < 1000) {
                id = "fig-000" + randomIndex;
            } else if (randomIndex > 1000 && randomIndex < 10000) {
                id = "fig-00" + randomIndex; 12237
            } else if (randomIndex > 10000 && randomIndex < 15000) {
                id = "fig-0" + randomIndex;
            }

            return id;

        }

        id = Randomizer();



        let firstResponse = await axios.get(`https://rebrickable.com/api/v3/lego/minifigs/${id}/sets/?key=1940e6fc5741fb5fccb8643f3c735fd1`) // toont de set waar minifig bijhoort
        let response2 = await axios.get(`https://rebrickable.com/api/v3/lego/minifigs/${id}/?key=1940e6fc5741fb5fccb8643f3c735fd1`) // toont de minifig
        let count = firstResponse.data.count ;
        let data = firstResponse.data.results ;
        let data2 = response2.data ;

        if (firstResponse.data.count === 1) {

            id = Randomizer();
            let newResponse = await axios.get(`https://rebrickable.com/api/v3/lego/minifigs/${id}/sets/?key=1940e6fc5741fb5fccb8643f3c735fd1`);
            let newResponse2 = await axios.get(`https://rebrickable.com/api/v3/lego/minifigs/${id}/?key=1940e6fc5741fb5fccb8643f3c735fd1`);

            return data = newResponse.data.results, data2 = newResponse2.data

        } 
        
        console.log(id);
        console.log(firstResponse.data.count)
        

        res.render('ordenen', { data: data, data2: data2, count: count })


    };
    legoApi();
    

});
app.get('/blacklist', (req: any, res: any) => {
    res.render('blacklist')
});
app.get('/login', (req: any, res: any) => {
    res.render('login')
});




app.listen(app.get('port'),
    () => console.log('[server] http://localhost:' + app.get('port')));
