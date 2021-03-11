 //curr streamname: btcusdt@trade
 function submitHelper(event) {
    const streamName = document.getElementById("newChart").value; 
    document.getElementById("newChart").value = "";
    // Make a URL-encoded string for passing POST data:
    newTracker(streamName);
}
//bind login button to loginAjax
document.getElementById("submit").addEventListener("click", submitHelper, false); 
 
 
 
 newTracker("btcusdt@trade");

 function newTracker(streamName){
     //general DOM manipulation for new chart
    var trackerDiv = document.createElement("div");
    var chartHeader = document.createElement("h1");
    chartHeader.appendChild(document.createTextNode("Chart: "+ streamName));
    var lastPrice = document.createElement("p");
    trackerDiv.appendChild(chartHeader);
    trackerDiv.appendChild(lastPrice);

    var ws = new WebSocket ("wss://stream.binance.us:9443/ws/" + streamName);
    var chart = LightweightCharts.createChart(trackerDiv, { width: 690, height: 420 });
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

    document.getElementById("charts").appendChild(trackerDiv);

    ws.onmessage = function (event) {
        var response = JSON.parse(event.data)
        var utcMiliSec = response.E
        var d = new Date(0)
        d.setUTCMilliseconds(utcMiliSec)
        //console.log(d)
        //var temp = {time: utcMiliSec, value: parseInt(response.p,10)}
        if(isReady){
            isReady = false
            base = response.p
        }
        console.log("p = "+response.p+" base = "+base)
        
        //if we go up a certain percent we might want to be able to sell that position
        if((response.p-base)/base >percentThreshold){
            console.log("triggered bull")
            base = response.p
            
            //return "Last Buy: "+base 
        }
        //if we go down a certain percent we want to buy that thing
        else if ((response.p-base)/base<downThreshold){
            console.log("triggered bear")
            base = response.p
            lastPrice.innerHTML = "Last Buy: "+base
            audio.play()
        }
        else{
            //do nothing
        }
        var temp = {time: utcMiliSec, value: response.p}
        bigData.push(temp)
        lineSeries.setData(bigData)    
    }

 }


