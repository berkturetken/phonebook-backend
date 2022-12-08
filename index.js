require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

// Return a view page
app.get("/info", (request, response) => {
  const view = `<p>Phonebook has info for ${
    phonebook.length
  } people</p> <p>${new Date()}</p> `;

  response.send(view);
});

// Retrieve all people
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// Retrieve a person
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((p) => {
    response.json(p);
  });
});

// Delete a person
app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => console.log(error));
});

generateId = () => {
  // Let's create a randomId between 1 and 10000
  const randomId = Math.floor(Math.random() * 10000) + 1;
  return randomId;
};

// Add a new person
app.post("/api/persons", (request, response) => {
  const body = request.body;
  // Error: the name is missing
  if (!body.name) {
    return response.status(400).json({
      error: "name field is missing",
    });
  }

  //const isPersonExist = phonebook.find((p) => p.name === body.name);

  // Error: The name already exists in the phonebook
  // if (isPersonExist) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  // Error: the number is missing
  if (!body.number) {
    return response.status(400).json({
      error: "phone number field is missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
