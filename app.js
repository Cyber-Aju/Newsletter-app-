const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html")
});

app.post("/",function(req,res){
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    const data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                mergefields : {
                    FNAME : firstname,
                    LNAME : lastname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mail.chimp.com/3.0/lists/8dbc41a1eb";

    const options = {
        method : "POST", // if successfull go for authenticate
        auth : "ajmal:1cbaec48eccd7cbcbcbe03d2148eb7df-us21"
    }

    const request = https.request(url, options, function(Response){
        if(Response.statusCode === 200){
            res.sendFile (__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        


    Response.on("data", function(data){
        console.log(JSON.parse(data));
    })
    })

    request.write(jsonData);

    request.end();
})

app.post("/failure", function(req,res){
    res.redirect("/")
});

app.listen(process.env.PORT || 3000, function(req,res){
    console.log("server is running on port 3000 ");
});


//Api key : 1cbaec48eccd7cbcbcbe03d2148eb7df-us21
// audience id : 8dbc41a1eb