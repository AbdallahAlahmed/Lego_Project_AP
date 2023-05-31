

const express = require('express');
const app = express();
const ejs = require('ejs');
const axios = require('axios');





app.set("view engine", "ejs");
app.set("port", 3000);
app.use(express.static('public'))

interface User {
    _id?: ObjectId,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    ChosenSet: LegoFigs[]
    BlackListed?: BlackListedFigs[]
}
interface BlackListedFigs {
    figId: string,
    figUrl: string,
    setId: string,
    setUrl: string,
    reden?: string
}

interface LegoFigs {
    figId: string,
    figUrl: string,
    setId: string,
    setUrl: string,
}

import { MongoClient, ObjectId } from "mongodb";
interface LegoSets {
    count: number,
    values: {
        name: string,
        set_img_url: string,
    }
}
interface LegoFigs {
    values: {
        figId: string,
        figUrlg: string,
        setId: string,
        setUrl: string
    }
}

let legoFigs: LegoFigs[];



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
    }
}
main();

app.get('/', (req: any, res: any) => {
    res.render('index')
});

app.get('/signup',(req : any, res : any)=>{
    res.render('signup')
})

app.post("/signup", async (req : any, res:any) => {
    try{
        await client.connect();
        console.log("Connected to Database");

        let userProfiles = client.db("Lego").collection("User");

        let firstname : string = req.body.firstname;
        console.log(firstname)
    

    } catch (e){
        console.error(e)
    } finally{
        client.close();
    }

    
});

app.get('/login', (req: any, res: any) => {
    res.render('login')
});

app.post('/login', async (req: any, res : any)=>{
    try{
        // connect to database
            await client.connect();
            console.log("connected to database");
        
            // user email and password from form
            let email = req.body.email;
            let password = req.body.password;
        console.log(email);
        console.log(password);

        // let userProfiles = client.db("Lego").collection("User");

        // //find user
        
        // let loggedInUser = await userProfiles.findOne<User>({email : email});
        
        // // check pw
        // if(password === loggedInUser?.password) {
        //     res.redirect(`/user/${loggedInUser?._id}`)
        // } else {
        //     res.render('login',{message : "You have enterd a wrong email or password"})
        // };

    
    } catch(e){
        console.error(e);
    } finally {
        await client.close();
    }

});

app.get('/user/:id', async (req: any, res: any) => {
    try {
        //database connection
        await client.connect();
        console.log("Connected to database");

        // get user id from url
        let id: number = req.params.id;

        // database collection
        let userProfiles = client.db("Lego").collection("User");

        //find the user
        let user = await userProfiles.findOne<User>({_id : new ObjectId(id)})
        res.render('home')
    } catch(e){
        console.log(e);

    } finally {
        await client.close();
    }
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
        //get random index voor random minifig
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
        //api call voor set waarbij minifig hoort
        let firstResponse = await axios.get(`https://rebrickable.com/api/v3/lego/minifigs/${id}/sets/?key=1940e6fc5741fb5fccb8643f3c735fd1`)
        //api call voor minifig
        let response2 = await axios.get(`https://rebrickable.com/api/v3/lego/minifigs/${id}/?key=1940e6fc5741fb5fccb8643f3c735fd1`)




        let count = firstResponse.data.count;
        let data = firstResponse.data.results;
        let data2 = response2.data;






        res.render('ordenen', { data: data, data2: data2, count: count })

        // if(legoSets[0].count > 1){

        //     res.render('ordenen', { data: data, data2: data2, count: count })

        // } else {
        //     res.redirect('ordenen')
        // }

        // if (legoSets[0].count <= 1) {
        //     const newApiCall = async () => {
        //         id = Randomizer();
        //         let newResponse = await axios.get(`https://rebrickable.com/api/v3/lego/minifigs/${id}/sets/?key=1940e6fc5741fb5fccb8643f3c735fd1`);
        //         let newResponse2 = await axios.get(`https://rebrickable.com/api/v3/lego/minifigs/${id}/?key=1940e6fc5741fb5fccb8643f3c735fd1`);
        //         console.log("why")
        //         data = newResponse.data.results;
        //         data2 = newResponse2.data;

        //        return legoSets = [
        //             {count : count ,values : {name : data.name, set_img_url : data.set_img_url}}
        //         ]

        //     }
        //     newApiCall();
        // }

        console.log(id);


    };
    legoApi();


});
app.get('/blacklist', (req: any, res: any) => {
    res.render('blacklist')
});




app.listen(app.get('port'),
    () => console.log('[server] http://localhost:' + app.get('port')));
