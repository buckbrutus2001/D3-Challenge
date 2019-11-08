// @TODO: YOUR CODE HERE!

// abbr: "AL"
// age: "38.6"
// ageMoe: "0.2"
// healthcare: "13.9"
// healthcareHigh: "15.1"
// healthcareLow: "12.7"
// id: "1"
// income: "42830"
// incomeMoe: "598"
// obesity: "33.5"
// obesityHigh: "35"
// obesityLow: "32.1"
// poverty: "19.3"
// povertyMoe: "0.5"
// smokes: "21.1"
// smokesHigh: "22.5"
// smokesLow: "19.8"
// state: "Alabama"

// Load data from hours-of-tv-watched.csv
(async function(){
    const censusData = await d3.csv("assets/data/data.csv").catch(error => console.warn(error));
    // console.log(censusData);
    // log a list of names
    // const names = censusData.map(data => data.name);
    // console.log("names", names);

    // Cast each hours value in tvData as a number using the unary + operator
    censusData.forEach(function(data) {
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.healthcare = +data.healthcare;
        data.healthcareHigh = +data.healthcareHigh ;
        data.healthcareLow = +data.healthcareLow ;
        data.id = +data.id ;
        data.income = +data.income ;
        data.incomeMoe = +data.incomeMoe ;
        data.obesity = +data.obesity ;
        data.obesityHigh = +data.obesityHigh ;
        data.obesityLow = +data.obesityLow ;
        data.poverty = +data.poverty ;
        data.povertyMoe = +data.povertyMoe ;
        data.smokes = +data.smokes ;
        data.smokesHigh = +data.smokesHigh ;
        data.smokesLow = +data.smokesLow ;
    });

    console.log(censusData);

})()

