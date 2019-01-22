const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(express.static('build'));
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const id = Math.floor(Math.random() * Math.floor(100000));
  const body = req.body;

  if(body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: 'content missing'
    });
  }
  if(persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: id
  };
  persons = persons.concat(person);
  res.json(person);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if(person) {
    res.json(person);
  }
  else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

app.get('/info', (req, res) => {
  res.send('Puhelinluettelossa ' + persons.length + ' henkilön tiedot. <br>' + new Date());
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});