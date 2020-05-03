const https = require('https')
const port = 3000;

//calculate distance from london
function calcDistance(lat, lon) {
    //london cordinates
    const londLat = 51.5085300;
    const londLon = -0.1257400;
    //check we have param and are not the same
    if ((!lat || !lon) || (lat == lon)) {
        return false;
    }
    else {
        var raLondlat = Math.PI * londLat / 180;
        var radLat = Math.PI * lat / 180;
        var theta = londLon - lon;
        var radTheta = Math.PI * theta / 180;
        var dist = Math.sin(raLondlat) * Math.sin(radLat) + Math.cos(raLondlat) * Math.cos(radLat) * Math.cos(radTheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515 * 0.8684;

        //if dist < 50 user within 50 miles of london
        if (dist < 50) {
            return true;
        } else {
            return false;
        }
    }
}


const requestHandler = https.get('https://bpdts-test-app.herokuapp.com/users', () => {
    let urls = ["https://bpdts-test-app.herokuapp.com/users", "https://bpdts-test-app.herokuapp.com/city/London/users"];
    let completed_requests = 0
    let = allLonUsers = [];
    let j = 0;

    //make 2 requests
    for (j in urls) {
        https.get(urls[j], function (res) {
            completed_requests++;
            //get all london users
            if (completed_requests == 1) {
                let body = '';
                let user = '';
                console.log('headers:', res.headers);
                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    let response = JSON.parse(body);
                    for (let i = 0; i < response.length; i++) {
                        allLonUsers.push(response[i])
                    }
                })
            }
            //get all users and filter out london users withing 50 miles
            if (completed_requests == urls.length) {
                let body = '';
                let user = '';
                console.log('headers:', res.headers);
                res.on('data', (chunk) => {
                    body += chunk;
                });

                res.on('end', () => {
                    let response = JSON.parse(body);
                    londonLocation = []
                    for (let i = 0; i < response.length; i++) {
                        if (calcDistance(response[i].latitude, response[i].longitude)) {
                            allLonUsers.push(response[i])
                        }
                    }
                    //log all users living in london or within 50 mile radius
                    for (let i = 0; i < allLonUsers.length; i++) {
                        console.log(allLonUsers[i].first_name + " " + allLonUsers[i].last_name)
                    }

                });
            }
        });
    }


}).on('error', (e) => {
    console.log("Got an error: ", e);
});


const server = https.createServer(requestHandler)

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})


