// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))


// Routes
// =============================================================

app.get(`/`, function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Displays all notes
app.get("/api/notes", (req, res) => {

    console.log("Well, we got this far");
    fs.readFile("db/db.json", "utf8", function(err, notes) {

        if (err) {
        return console.log(err);
        }
    
        console.log(notes);
        notes = JSON.parse(notes);
        return res.json(notes);
    });
});


// Create New Notes
app.post("/api/notes", function(req, res) {
	var newNote = req.body;
	newNote.routeName = newNote.name.replace(/\s+/g, "").toLowerCase();

	console.log(newNote);

	function readNotes(callback) {
		fs.readFile("db/db.json", "utf8", function(err, notes) {
			if (err) return callback(err);
			callback(null, notes);
		})
	}

	readNotes(function (err, notes) {
		notes.push(newNote);

		fs.writeFile("db/db.json", notes, function(err) {
			if (err) {
				return console.log(err);
			}
			console.log("Success!");
		});
	})
  res.json(newNote);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
