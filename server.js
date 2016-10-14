(() => {

    "use strict";

    var path = require("path");
    var urlExpander = require("expand-url");
    var port = process.env.PORT || 1123;
    var express = require("express");
    var app = express();

    var staticResources = ["/scripts", "/styles"];

    //Enable CORS requests for our service!
    //Thanks to http://enable-cors.org/server_expressjs.html for this great assist!
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    //Make these directories static so that their files can be served.
    staticResources.map(p => app.use(p, express.static(`${__dirname}${p}`)));

    app.get("/", function (req, res) {
        res.sendFile(path.join(`${__dirname}/index.html`));
    });

    //Expose an endpoint to allow expanding shortened URLs.
    app.get("/api/inflate", function (req, res) {
        var responseMsg = {
            success: false,
            data: null
        };
        var requestedUrl = null;
        //We have to use .bind here, otherwise the this context isn't right.
        var sendResponse = res.json.bind(res);

        if (req.query && req.query.url) {
            requestedUrl = req.query.url;

            //Leveraging the url expander node package.
            urlExpander.expand(requestedUrl, function (error, inflated) {
                if (error) {
                    //Something went wrong.
                    //I don't want to expose the internal error message.
                    //Let's just give back a general help message.
                    responseMsg.success = false;
                    responseMsg.data = "There was an error expanding your URL. Please check the URL and try again.";
                } else {
                    //Looks like things worked out fine.
                    //Let's give the user their data.
                    responseMsg.success = true;
                    responseMsg.data = {
                        requestedUrl: requestedUrl,
                        inflatedUrl: inflated
                    };
                }
                //Finally give the user back the JSON response.
                sendResponse(responseMsg);
            });
        } else {
            //The GET request didn't have the query string param that we were looking for.
            //We need to notify the user of this issue.
            //We are expecting a "url" query string parameter in the URL.
            responseMsg.success = false;
            responseMsg.data = "The URL that you provided was invalid. Please check your request and try again.";
            //Finally give the user back the JSON response.
            sendResponse(responseMsg);
        }
    });

    //Start the server.
    app.listen(port, function () {
        console.log(`Listening on port ${port}!`);
    });

})();