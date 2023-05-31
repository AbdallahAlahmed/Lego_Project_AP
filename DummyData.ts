import { MongoClient, ObjectId } from "mongodb"

interface User {
    _id? : ObjectId,
    firstname: string,
    lastname: string,
    email: string,
    password : string,
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


let PeoplePofile: User[] = [
    {
        firstname: "rishab",
        lastname: "Bhandari",
        email: "bhandari.rishab2@gmail.com",
        password : "rishab123",
        ChosenSet: [
            {
                figId: "fig-009978",
                figUrl: "https://cdn.rebrickable.com/media/sets/fig-009978/117786.jpg",
                setId: "80105-1",
                setUrl: "https://cdn.rebrickable.com/media/sets/80105-1/602.jpg"
            },
            {
                figId: "fig-009579",
                figUrl: "https://cdn.rebrickable.com/media/sets/fig-009579/117786.jpg",
                setId: "76159-1",
                setUrl: "https://rebrickable.com/sets/76159-1/jokers-trike-chase/"
            },
            {
                figId: "fig-008570",
                figUrl: "https://cdn.rebrickable.com/media/sets/fig-008570/117786.jpg",
                setId: "6326-1",
                setUrl: "https://cdn.rebrickable.com/media/sets/6326-1/2925.jpg"
            },
        ],
        BlackListed: [
            {
                figId: "fig-008570",
                figUrl: "https://cdn.rebrickable.com/media/sets/fig-008570/117786.jpg",
                setId: "6326-1",
                setUrl: "https://cdn.rebrickable.com/media/sets/6326-1/2925.jpg",
                reden : "niet mooi"
            },
            {
                figId: "fig-008570",
                figUrl: "https://cdn.rebrickable.com/media/sets/fig-008570/117786.jpg",
                setId: "6326-1",
                setUrl: "https://cdn.rebrickable.com/media/sets/6326-1/2925.jpg",
                reden : "niet leuk"
            }
        ]
    }
]

const uri: string = "mongodb+srv://UserLego:UserTeamLego@lego.u2sfsfn.mongodb.net/?retryWrites=true&w=majority/"

const client = new MongoClient(uri);

const showAll = async () => {
    let miniFigs = client
        .db("Lego")
        .collection("User");
    let Users = await miniFigs
        .find<User>({})
        .toArray();
    console.table(Users);
}

const DeleteAll = async () =>{
    let miniFigs = client
        .db("Lego")
        .collection("User");
    await miniFigs.deleteMany({});
}

const main = async () => {
    try {
        await client.connect();
        console.log("connect to database");

        // await DeleteAll();

        let userProfile = client.db("Lego").collection("User").find<User>({}).toArray();

        if((await userProfile).length == 0){
            await client.db("Lego").collection("User").insertMany(PeoplePofile);
        }

        await showAll();

    } catch (e) {
        console.error(e);

    }  finally{
        await client.close();
    }

}

main();