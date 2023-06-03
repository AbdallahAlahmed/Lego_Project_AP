
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
    firstname: string | undefined,
    lastname: string | undefined,
    email: string | undefined,
    password: string | undefined,
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
import { randomFig } from "./randomFig";

let legoFigs: LegoFigs[];



const uri = "mongodb+srv://UserLego:UserTeamLego@lego.u2sfsfn.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);


app.get('/', (req: any, res: any) => {
    res.render('index')
});

app.get('/signup', (req: any, res: any) => {
    res.render('signup')
})

app.post("/signup", async (req: any, res: any) => {
    try {
        await client.connect();
        console.log("Connected to Database");

        let userProfiles = client.db("Lego").collection("User");

        let newRegisterdUser: User[] = [{
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password
        }]

        await userProfiles.insertMany(newRegisterdUser);

        res.render('signupCompleet', { firstname: req.body.firstname })


    } catch (e) {
        console.error(e)
    } finally {
        client.close();
    }


});

app.get('/login', (req: any, res: any) => {
    res.render('login', { message: " " })
});

app.post('/login', async (req: any, res: any) => {
    try {

        // connect to database
        await client.connect();
        console.log("connected to database");

        // user email and password from form
        let email = req.body.email;
        let password = req.body.password;


        let userProfiles = client.db("Lego").collection("User");

        //find user

        let loggedInUser = await userProfiles.findOne<User>({ email: email });

        // check pw
        if (password === loggedInUser?.password) {
            res.redirect(`/user/${loggedInUser?._id}`)
        } else {
            res.render('login', { message: "You have enterd a wrong email or password" })
        };


    } catch (e) {
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
        let user = await userProfiles.findOne<User>({ _id: new ObjectId(id) })
        res.render('home', { id: id })
    } catch (e) {
        console.log(e);

    } finally {
        await client.close();
    }
});
app.get('/user/:id/bekijk', async (req: any, res: any) => {
    try {

        //Connect 
        await client.connect();
        console.log("Connected to Database")

        // get id
        let id: number = req.params.id;

        //Collection
        let userProfiles = client.db("Lego").collection("User");

        //Find User
        let user = await userProfiles.findOne<User>({ _id: new ObjectId(id) });

        // let gekozenFig : LegoFigs[] = [];

        if (user?.ChosenSet) {

            // for (let i = 0; i < user?.ChosenSet?.length; i++) {

            //     gekozenFig  = [{
            //         figId : user?.ChosenSet?.[i].figId,
            //         figUrl : user?.ChosenSet?.[i].figUrl,
            //         setId : user?.ChosenSet?.[i].setId,
            //         setUrl : user?.ChosenSet?.[i].setUrl  
            //     }]


            //     console.log(user?.ChosenSet?.[i]);

            // }


            res.render('bekijk', { user: user, id: id })
        }



    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }

});


app.get('/user/:id/vraagOrdenen', async (req: any, res: any) => {

    try {
        await client.connect();
        console.log("Connected to Database");

        // get id
        let id: number = req.params.id;

        //Collection
        let userProfiles = client.db("Lego").collection("User");

        //Find User
        let user = await userProfiles.findOne<User>({ _id: new ObjectId(id) });

        let count = req.body.count;



        res.render('vraagOrdenen', { id: id })

    } catch (e) {
        console.log(e);

    } finally {

        await client.close();

    }


    // <button onclick="saveCount()" type="submit" ><a href="/user/<%= id %>/ordenen">OK</a></button>

});

app.post('/user/:id/vraagOrdenen', async (req: any, res: any) => {

    try {
        await client.connect();
        console.log("Connected to Database");

        // get id
        let id: number = req.params.id;

        //Collection
        let userProfiles = client.db("Lego").collection("User");

        //Find User
        let user = await userProfiles.findOne<User>({ _id: new ObjectId(id) });

        let orderAmount = req.body.orderAmount;


        console.log("ghfghfh");
        console.log(orderAmount);

        res.redirect(`/user/${id}/ordenen/${orderAmount}`)



        // res.render('vraagOrdenen', {id : id})

    } catch (e) {
        console.log(e);

    } finally {

        await client.close();

    }


    // <button onclick="saveCount()" type="submit" ><a href="/user/<%= id %>/ordenen">OK</a></button>

});

app.get('/user/:id/ordenen/:orderAmount', async (req: any, res: any) => {
    try {

        await client.connect();
        console.log("Connected to Database");

        let orderAmount: number = req.params.orderAmount;
        let id: number = req.params.id;


        const minifig = await randomFig();

        console.log(minifig.setData)
        console.log(minifig.minifigData)

        console.log(orderAmount);


        res.render('ordenen', { setData: minifig.setData, minifigData: minifig.minifigData, orderAmount: orderAmount, id: id })



    } catch (e) {
        console.log(e);

    } finally {

        await client.close();

    }

});

app.post('/user/:id/ordenen/:orderAmount', async (req: any, res: any) => {

    try {
        // connect
        await client.connect();
        console.log("Connected to database")


        //get id
        let userId = req.params.id



        let minifigNum = req.body.minifigNum;
        let minifigImg = req.body.minifigImg;
        let setImg = req.body.setImg;
        let setNum = req.body.setNum;
        let reden = req.body.reden

        let userProfiles = client.db("Lego").collection("User");


        let blacklistedSet: BlackListedFigs[] = [{
            figId: minifigNum,
            figUrl: minifigImg,
            setId: setNum,
            setUrl: minifigImg,
            reden: reden
        }]

        let gekozenSet: LegoFigs[] = [{
            figId: minifigNum,
            setId: setNum,
            figUrl: minifigImg,
            setUrl: setImg
        }]

        if (reden) {
            let updateBlacklist = await userProfiles.updateOne(
                { _id: new ObjectId(userId) },
                { $push: { BlackListed: { $each: blacklistedSet } } }
            )
        } else {
            const results = await userProfiles.updateOne(
                { _id: new ObjectId(userId) },
                { $push: { ChosenSet: { $each: gekozenSet } } }
            );

        }


        let orderAmount: number = req.params.orderAmount;
        let id: number = req.params.id;

        orderAmount--;

        const minifig = await randomFig();

        if (orderAmount != 0) {
            res.render('ordenen', { setData: minifig.setData, minifigData: minifig.minifigData, orderAmount: orderAmount, id: id })
        } else {
            res.render('vraagOrdenen', { id: userId })
        }


    } catch (e) {
        console.error(e)


    } finally {

        client.close();

    }

});

app.get('/user/:id/blacklist', async (req: any, res: any) => {
    try {

        //Connect 
        await client.connect();
        console.log("Connected to Database")

        // get id
        let id: number = req.params.id;

        //Collection
        let userProfiles = client.db("Lego").collection("User");

        //Find User
        let user = await userProfiles.findOne<User>({ _id: new ObjectId(id) });


        if (user?.BlackListed) {
            res.render('blacklist', { user: user, id : id })
        }


    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }

});




app.listen(app.get('port'),
    () => console.log('[server] http://localhost:' + app.get('port')));
