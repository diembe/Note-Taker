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

// Star Wars Characters (DATA)
// =============================================================
var characters = [
  {
    routeName: "yoda",
    name: "Yoda",
    role: "Jedi Master",
    age: 900,
    forcePoints: 2000
  },
  {
    routeName: "darthmaul",
    name: "Darth Maul",
    role: "Sith Lord",
    age: 200,
    forcePoints: 1200
  },
  {
    routeName: "obiwankenobi",
    name: "Obi Wan Kenobi",
    role: "Jedi Master",
    age: 55,
    forcePoints: 1350
  }
];

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

// Displays a single character, or returns false
app.get("/api/characters/:character", function(req, res) {
  var chosen = req.params.character;

  console.log(chosen);

  for (var i = 0; i < characters.length; i++) {
    if (chosen === characters[i].routeName) {
      return res.json(characters[i]);
    }
  }

  return res.json(false);
});

// Create New Characters - takes in JSON input
app.post("/api/notes", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
	var newNote = req.body;

	// Using a RegEx Pattern to remove spaces from newCharacter
	// You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
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
