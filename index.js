import express from "express";
import axios from "axios";

const app = express();
const port = 3001;
const API_URL = "https://byabbe.se/on-this-day/"


app.use(express.static("public"));
app.use(express.urlencoded({ extended : true}));


app.get("/", (req, res) => {
    res.render("index.ejs", { fact: `Hey! I'm Text 2 fact! generator.\r\nProvide your text or leave this one and smash #Big Brainz to generate a fact from Wikipedia!\r\n\nI am currently looking to gain valuable experience\r\nIf you are looking for junior dev, message me: stshellletsski@gmail.com\r\n\nCredits:\r\nhttps://pattern.monster/\r\nAlbin Larsson - https://byabbe.se/\r\n`});
});

app.post("/get", async (req, res) => {
    let input = req.body.text.replace(/\W/g, '').split("").map(x=>x.charCodeAt(0)).join(""); 
        
    let date;
    if (input.length) {
        date = Number(dateFromText(input));
    } else {
        date = 123123123123123;
    }
    
    const month = new Date(date).getMonth();
    const day = new Date(date).getDate();
    const endpoint = `${month}/${day}/events.json`
   
    try {
        const result = await axios.get(API_URL + endpoint);
        const event = new RandomEvent(result.data);
        res.render("index.ejs", { fact: `Date: ${event.date}\n\nFact: ${event.description}\n\nLink (not clickable): ${event.eventLink}`});
    }   catch (error) {
        console.log(error.code);
        res.render("index.ejs", { fact: "Fact: There was a malfunction. What do?!" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

////////////////////////////////////////////////////////////////////////////////////////////////



// eventsData <= props format:
// .wikipedia <= wiki link to date; .date <= month/day of events; .events <= array of event objects
// .events <= props format:
// .length <= number of events; [i] <= i-th event from array
// eventsData.events[i] <= props format:
// .year <= year of event;  .description <= event description .wikipedia <= array of wiki links related to event
function RandomEvent (eventsData) {
    this.numberOfEvents = eventsData.events.length;
    this.eventSelector = function (x) {return Math.floor(Math.random()*x)};
    this.eventId = this.eventSelector(this.numberOfEvents);
    this.date = `${eventsData.date}, ${eventsData.events[this.eventId].year}`;
    this.description = eventsData.events[this.eventId].description;
    this.eventLinksList = eventsData.events[this.eventId].wikipedia;
    this.eventLink = this.eventLinksList[0].wikipedia;
    this.eventLinks = "";
    this.eventLinksGenerator = function (x) {x.forEach(event => this.eventLinks = this.eventLinks + `${event.wikipedia}\n`);}
    this.eventLinksGenerator(this.eventLinksList);
}

function dateFromText (text) {
    let val =  text; 
    let ranDate = "";
    let ranIndex = 0;
    while(ranDate.length !== 14) {
        ranIndex = Math.floor(Math.random()*val.length);
        ranDate = ranDate + val.slice(ranIndex, ranIndex+1);
    }
    return ranDate;
}