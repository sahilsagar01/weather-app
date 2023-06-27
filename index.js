require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https")
const ejs = require("ejs");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname+"/public"))


app.get("/" , function(req,res){
    res.render("home" )
})
app.post("/" , function(req , res){
    const cityName = req.body.searchCity;

    const key = process.env.apiKey
    
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+key+"&units=metric"

    https.get(url , function(response) {
        response.on("data" , function(data){
            console.log(data)
            const weatherinfo = JSON.parse(data);
           
            console.log(JSON.parse(data))
            console.log(weatherinfo.cod)
            if(weatherinfo.cod === 200){
                const NAME = weatherinfo.name;
                const temp = weatherinfo.main.temp;
                const weatdes = weatherinfo.weather[0].description;
                const icon = weatherinfo.weather[0].icon;
                const windSpeed = weatherinfo.wind.speed;
                const Hdt = weatherinfo.main.humidity;
                const country = weatherinfo.sys.country;
                const imageurl = " https://openweathermap.org/img/wn/"+icon+"@2x.png"
                // res.write("<h1> The temprature in "+NAME+" is "+temp+ " degree celcius. </h1>");
                // res.write("<P>The weather is currently "+weatdes+"</p>");
                // res.write("<img src="+imageurl+">");
                // res.send()
            res.render("result" , {HEADING: NAME , TEMP: temp , weatdes: weatdes ,imageurl , windSpeed: windSpeed ,Hdt: Hdt, country: country})
            }else{
                const Code = weatherinfo.cod;
                const Message = weatherinfo.message;
                res.render("error" , {Cod: Code , Mess: Message})
            }
        });
    });
});

app.get("/about" , function(req , res){
    res.render("about")
});
app.get("/contact" , function(req , res){
    res.render("contact")
})


app.listen( 3003 , function(){
    console.log("server is up and running")
})