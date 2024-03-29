
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

        if (user?.ChosenSet) {

            res.render('bekijk', { user: user, id: id })
        }



    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }

});

app.post('/user/:id/bekijk', async (req: any, res: any) => {
    try {

        //Connect 
        await client.connect();
        console.log("Connected to Database")

        // get id
        let id: number = req.params.id;
        //get minifigid
        let figId: number = req.body.minifigNum;
        //Collection
        let userProfiles = client.db("Lego").collection("User");
        //Find User
        let user = await userProfiles.findOne<User>({ _id: new ObjectId(id) });


        if (figId) {
            await userProfiles.updateOne(
                { _id: new ObjectId(id) },
                { $pull: { ChosenSet: { figId: figId } } }
            );

            let updatedUser = await userProfiles.findOne<User>({ _id: new ObjectId(id) });


            res.render('bekijk', { user: updatedUser, id: id })
        } else if (user?.ChosenSet) {
            res.render('bekijk', { user: user, id: id })
        }


    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }

})


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


        res.redirect(`/user/${id}/ordenen/${orderAmount}`)



    } catch (e) {
        console.log(e);

    } finally {

        await client.close();

    }


});

app.get('/user/:id/ordenen/:orderAmount', async (req: any, res: any) => {
    try {

        await client.connect();
        console.log("Connected to Database");

        let orderAmount: number = req.params.orderAmount;
        let id: number = req.params.id;


        const minifig = await randomFig();

        res.render('ordenen', { setData: minifig.setData, minifigData: minifig.minifigData, orderAmount: orderAmount, id: id })

    } catch (e) {
        console.log(e);

    } finally {

        await client.close();

    }

});
let geordendeFiguren: number = 0;
let aantalSkips: number = 0

app.post('/user/:id/ordenen/:orderAmount', async (req: any, res: any) => {

    try {
        // connect
        await client.connect();
        console.log("Connected to database")


        //get info
        let userId = req.params.id
        let minifigNum = req.body.minifigNum;
        let minifigImg = req.body.minifigImg;
        let setImg = req.body.setImg;
        let setNum = req.body.setNum;
        let reden = req.body.reden
        let skip = req.body.skip;


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

        console.log(skip);

        if (skip) {
            aantalSkips++
        }

        if (reden) {
            let updateBlacklist = await userProfiles.updateOne(
                { _id: new ObjectId(userId) },
                { $push: { BlackListed: { $each: blacklistedSet } } }
            )
        } else if (skip == undefined) {
            const results = await userProfiles.updateOne(
                { _id: new ObjectId(userId) },
                { $push: { ChosenSet: { $each: gekozenSet } } }
            );

            geordendeFiguren++;

        }

        let orderAmount: number = req.params.orderAmount;
        let id: number = req.params.id;

        orderAmount--;

        const minifig = await randomFig();

        if (orderAmount != 0) {
            res.render('ordenen', { setData: minifig.setData, minifigData: minifig.minifigData, orderAmount: orderAmount, id: id })
        } else {
            res.render('overzicht', { id: userId, aantalSkips: aantalSkips, orderAmount: orderAmount, geordendeFiguren: geordendeFiguren })
            //reset geordende figuren
            geordendeFiguren = 0;
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
            res.render('blacklist', { user: user, id: id })
        }


    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }

});

app.post('/user/:id/blacklist', async (req: any, res: any) => {
    try {

        //Connect 
        await client.connect();
        console.log("Connected to Database")

        // get id
        let id: number = req.params.id;
    
        // get figId
        let figId = req.body.minifigNum;

        //Collection
        let userProfiles = client.db("Lego").collection("User");

        //Find User
        let user = await userProfiles.findOne<User>({ _id: new ObjectId(id) });


        if(figId){
            await userProfiles.updateOne(
                { _id: new ObjectId(id) },
                { $pull: { BlackListed: { figId: figId } } }
            );

            let updatedUser = await userProfiles.findOne<User>({ _id: new ObjectId(id) });
            res.render('blacklist', { user: updatedUser, id: id })

        } else if (user?.BlackListed) {
            res.render('blacklist', { user: user, id: id })
        }




    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }

});

app.post('/user/:id/redenAanpassen', async (req: any, res: any) => {
    try {

        //Connect 
        await client.connect();
        console.log("Connected to Database")

        // get id
        let id: number = req.params.id;
    
        // get reden
        let redenAanpassen = req.body.reden;
        let nieuweReden = req.body.nieuweReden;
        let figId = req.body.minifigNum

        //Collection
        let userProfiles = client.db("Lego").collection("User");

        //Find User
        let user = await userProfiles.findOne<User>({ _id: new ObjectId(id) });


        if(redenAanpassen){
            await userProfiles.updateOne(
                { _id: new ObjectId(id), 'BlackListed.figId': figId },
                { $set: { 'BlackListed.$.reden': nieuweReden } }
              );

            let updatedUser = await userProfiles.findOne<User>({ _id: new ObjectId(id) });
            res.render('blacklist', { user: updatedUser, id: id })

        } else if (user?.BlackListed) {
            res.render('blacklist', { user: user, id: id })
        }

    } catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }

});

app.get('/user/:id/:figId/parts', async (req: any, res: any) => {

    let figId: number = req.params.figId;
    let id: number = req.params.id

    let responseParts = await axios.get(`https://rebrickable.com/api/v3/lego/minifigs/${figId}/parts/?key=1940e6fc5741fb5fccb8643f3c735fd1`)

    let dataParts = responseParts.data.results;

    res.render('parts', { dataParts: dataParts, id: id })


});

app.get('/user/:id/:setId/minifigs', async (req: any, res: any) => {

    let setId: number = req.params.setId;
    let id: number = req.params.id

    let responseSets = await axios.get(`https://rebrickable.com/api/v3/lego/sets/${setId}/minifigs/?key=1940e6fc5741fb5fccb8643f3c735fd1`)

    let dataSets = responseSets.data.results;

    res.render('minifigs', { dataSets: dataSets, id: id })

});




app.listen(app.get('port'),
    () => console.log('[server] http://localhost:' + app.get('port')));
