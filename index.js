require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

// Return a view page
app.get('/info', (request, response) => {
  const view = `<h2>Welcome to the Phonebook Application</h2> <p>${new Date()}</p> `
  response.send(view)
})

// Retrieve all people
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons)
    })
    .catch((error) => {
      next(error)
    })
})

// Retrieve a person
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((p) => {
      if (p) {
        response.json(p)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

// Delete a person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// Update a person
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      response.json(updatedPerson.toJSON())
    })
    .catch((error) => next(error))
})

// Add a new person
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  // Error: the name or phone number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or phone number field is missing',
    })
  }

  Person.findOne({ name: body.name }).then((result) => {
    if (result) {
      response
        .status(400)
        .json({ error: `${body.name} is already added to phonebook!` })
      console.log('Not implemented yet!')
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      })

      person
        .save()
        .then((savedPerson) => {
          response.json(savedPerson)
        })
        .catch((error) => next(error))
    }
  })
})

// Error handling
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
