const express = require("express");
const morgan = require('morgan')
const app = express();

app.use(express.json());
app.use(morgan('tiny'));


let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Berk Türetken",
    number: "11-22-333444",
  },
];

// Retrieve all people
app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

// Return a view page
app.get("/info", (request, response) => {
  const view = `<p>Phonebook has info for ${
    phonebook.length
  } people</p> <p>${new Date()}</p> `;

  response.send(view);
});

// Retrieve a person
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// Delete a person
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((p) => p.id !== id);

  response.status(204).end();
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

  const isPersonExist = phonebook.find((p) => p.name === body.name);

  // Error: The name already exists in the phonebook
  if (isPersonExist) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  // Error: the number is missing
  if (!body.number) {
    return response.status(400).json({
      error: "phone number field is missing",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  phonebook = phonebook.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
