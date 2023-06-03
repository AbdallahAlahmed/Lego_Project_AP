import  axios  from "axios";

export const randomFig = async () : Promise<any> => {

    let id: string = "";
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

    //api call voor set waarbij minifig hoort
    let firstResponse = await axios.get(`https://rebrickable.com/api/v3/lego/minifigs/${id}/sets/?key=1940e6fc5741fb5fccb8643f3c735fd1`)
    //api call voor minifig
    let response2 = await axios.get(`https://rebrickable.com/api/v3/lego/minifigs/${id}/?key=1940e6fc5741fb5fccb8643f3c735fd1`)
    let count = firstResponse.data.count;
    let setData = firstResponse.data.results;
    let minifigData = response2.data;

    if(count<2){

        return randomFig();

    }

    return {minifigData,setData}

}



