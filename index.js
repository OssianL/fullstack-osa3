require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(express.static('build'));
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons.map(person => person.toJSON()));
    });
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if(body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: 'content missing'
    });
  }
  const person = new Person({
    name: body.name,
    number: body.number
  });
  person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person.toJSON());
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;
  const person = {number: body.number};
  Person.findByIdAndUpdate(req.params.id, person, {new:true})
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON());
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      res.send('Puhelinluettelossa ' + persons.length + ' henkilön tiedot. <br>' + new Date());
    });
});

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if(error.name === 'CastError' && error.kind == 'ObjectId') {
    return res.status(400).send({error: 'malformatted id'});
  }
  if(error.name === 'ValidationError') {
    return res.status(400).json({error: error.message});
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});