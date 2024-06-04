var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://127.0.0.1/vasuman", function(err, client) {
    if (!err) {
        console.log("We are connected");
        const db = client.db('vasuman');
        app.use(express.static('public'));

        app.get('/', function(req, res) {
            res.sendFile(__dirname + '/' + 'index.html');
        });

        app.get('/insert.html', function(req, res) {
            res.sendFile(__dirname + '/' + 'insert.html');
        });

        app.get('/delete.html', function(req, res) {
            res.sendFile(__dirname + '/' + 'delete.html');
        });

        app.get('/update.html', function(req, res) {
            res.sendFile(__dirname + '/' + 'update.html');
        });

        app.get('/insert', function(req, res) {
            var id = req.query.id;
            var namee = req.query.namee;
            var title = req.query.title;
            var branch = req.query.branch;
            console.log("id=" + id + " name=" + namee + " title=" + title + " branch=" + branch);
            db.collection('department').insertOne({ id: id, name: namee, title: title, branch: branch }, function(err, result) {
                if (err) {
                    console.log("Error inserting document:", err);
                    res.status(500).send("Error inserting document");
                } else {
                    res.end(JSON.stringify(req.query));
                }
            });
        });

        app.get('/display', function(req, res) {
            db.collection('department').find({ branch: 'cse', title: 'professor' }).sort().toArray(function(err, data) {
                if (err) {
                    console.log("Error fetching documents:", err);
                    res.status(500).send("Error fetching documents");
                } else {
                    console.log(data);
                    res.end(JSON.stringify(data));
                }
            });
        });

        // Add a route for deleting documents
        app.get('/delete', function(req, res) {
            var id = req.query.id;
            db.collection('department').deleteOne({ id: id }, function(err, result) {
                if (err) {
                    console.log("Error deleting document:", err);
                    res.status(500).send("Error deleting document");
                } else {
                    res.end("Document with id " + id + " deleted");
                }
            });
        });

        // Add a route for updating documents
        app.get('/update', function(req, res) {
            var id = req.query.id;
            var updateFields = {};
            if (req.query.name) updateFields.name = req.query.name;
            if (req.query.title) updateFields.title = req.query.title;
            if (req.query.branch) updateFields.branch = req.query.branch;

            db.collection('department').updateOne({ id: id }, { $set: updateFields }, function(err, result) {
                if (err) {
                    console.log("Error updating document:", err);
                    res.status(500).send("Error updating document");
                } else {
                    res.end("Document with id " + id + " updated");
                }
            });
        });

        app.listen(5000, function() {
            console.log("Server is listening on port 5000");
        });
    } else {
        console.error("Error connecting to the database:", err);
    }
});
