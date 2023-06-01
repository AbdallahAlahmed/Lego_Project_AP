
const express = require('express');
const app = express();
const ejs = require('ejs');
const axios = require('axios');





app.set("view engine", "ejs");
app.set("port", 3000);
app.use(express.static('public'))
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

interface User {
    _id?: ObjectId,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    ChosenSet?: LegoFigs[]
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
    figId: string | undefined,
    figUrl: string | undefined,
    setId: string | undefined,
    setUrl: string | undefined,
}

import { MongoClient, ObjectId } from "mongodb";

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

        let newRegisterdUser : User[] = [{
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            email : req.body.email,
            password : req.body.password  
        }]

      await userProfiles.insertMany(newRegisterdUser);

      res.render('signupCompleet',{firstname : req.body.firstname})
    

    } catch (e){
        console.error(e)
    } finally{
        client.close();
    }

    
});

app.get('/login', (req: any, res: any) => {
    res.render('login',{message : " "})
});

app.post('/login', async (req: any, res : any)=>{
    try{

        // connect to database
        await client.connect();
        console.log("connected to database");
        
        // user email and password from form
        let email = req.body.email;
        let password = req.body.password;
       
        
        let userProfiles = client.db("Lego").collection("User");

        //find user
        
        let loggedInUser = await userProfiles.findOne<User>({email : email});
        
        // check pw
        if(password === loggedInUser?.password) {
            res.redirect(`/user/${loggedInUser?._id}`)
        } else {
            res.render('login',{message : "You have enterd a wrong email or password"})
        };

    
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
app.get('/user/:id/bekijk', async(req: any, res: any) => {
    try {

        //Connect 
        await client.connect();
        console.log("Connected to Database")

        // get id
        let id: number = req.params.id;

        //Collection
        let userProfiles = client.db("Lego").collection("User");

        //Find User
        let user = await userProfiles.findOne<User>({_id : new ObjectId(id)});
        
        // let gekozenFig : LegoFigs[] = [];

        if(user?.ChosenSet){
            
            // for (let i = 0; i < user?.ChosenSet?.length; i++) {
                
            //     gekozenFig  = [{
            //         figId : user?.ChosenSet?.[i].figId,
            //         figUrl : user?.ChosenSet?.[i].figUrl,
            //         setId : user?.ChosenSet?.[i].setId,
            //         setUrl : user?.ChosenSet?.[i].setUrl  
            //     }]
                
                
            //     console.log(user?.ChosenSet?.[i]);
                
            // }

    
            res.render('bekijk', {user : user})
        }


        
    } catch (e) {
        console.log(e)
    } finally{
        await client.close();
    }
   
});
app.get('/user/:id/ordenen', (req: any, res: any) => {

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
app.get('/user/:id/blacklist', async(req: any, res: any) => {
    try {

        //Connect 
        await client.connect();
        console.log("Connected to Database")

        // get id
        let id: number = req.params.id;

        //Collection
        let userProfiles = client.db("Lego").collection("User");

        //Find User
        let user = await userProfiles.findOne<User>({_id : new ObjectId(id)});
        

        if(user?.BlackListed){
            res.render('blacklist', {user : user})
        }

        
    } catch (e) {
        console.log(e)
    } finally{
        await client.close();
    }
   
});




app.listen(app.get('port'),
    () => console.log('[server] http://localhost:' + app.get('port')));
