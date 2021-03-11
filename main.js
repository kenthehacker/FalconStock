var ws = new WebSocket ("wss://stream.binance.us:9443/ws/btcusdt@trade") 
var chart = LightweightCharts.createChart(document.body, { width: 690, height: 420 });
var audio = new Audio('bearSound.mp3');

var bigData = []

var lineSeries = chart.addLineSeries();

//percent change initialiser, sets the first value
var base = 0
var isReady = true

var percentThreshold = 0.05
var downThreshold = -0.02

/*
var utcSeconds = 1234567890;
var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
d.setUTCSeconds(utcSeconds);
*/

ws.onmessage = function (event) {
    var jsonShit = JSON.parse(event.data)
    var utcMiliSec = jsonShit.E
    var d = new Date(0)
    d.setUTCMilliseconds(utcMiliSec)
    //console.log(d)
    //var temp = {time: utcMiliSec, value: parseInt(jsonShit.p,10)}
    if(isReady){
        isReady = false
        base = jsonShit.p
    }
    console.log("p = "+jsonShit.p+" base = "+base)
    
    //if we go up a certain percent we might want to be able to sell that position
    if((jsonShit.p-base)/base >percentThreshold){
        console.log("triggered bull")
        base = jsonShit.p
        
        //return "Last Buy: "+base 
    }
    //if we go down a certain percent we want to buy that thing
    else if ((jsonShit.p-base)/base<downThreshold){
        console.log("triggered bear")
        base = jsonShit.p
        document.getElementById("lastPrice").innerHTML = "Last Buy: "+base
        audio.play()
    }
    else{
        //do nothing
    }
    var temp = {time: utcMiliSec, value: jsonShit.p}
    bigData.push(temp)
    lineSeries.setData(bigData)    
}





