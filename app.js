const express = require("express");
const request = require("request");
const path = require("path");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}))

app.use(express.static(path.join(__dirname, "public")));

app.post("/signup", (req, res) => {
    const { firstname, lastname, email} = req.body;
    if(!firstname || !lastname || !email) {
        res.redirect("/fail.html");
        return
    }

    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                Merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const options = {
        url: "https://us10.api.mailchimp.com/3.0/lists/907af9c4b2",
        method: "POST",
        headers: {
            Authorization: "auth "
        },
        body: jsonData
    }

    request(options, (err, response, body) => {
        if(err) {
            res.redirect("fail.html");
            return
        }
        else {
            if(response.statusCode === 200) {
                res.redirect("success.html");
            }
            else{
                res.redirect("fail.html");
            }
        }
    })

})

app.listen(PORT, console.log(`Server is running at PORT ${PORT}`));