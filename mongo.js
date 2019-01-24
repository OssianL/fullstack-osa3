const mongoose = require('mongoose');

if(process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const newName = process.argv[3];
const newNumber = process.argv[4];
const url = `mongodb://dburpo:${password}@ds213118.mlab.com:13118/hy_fullstack_puhelinluettelo_production`;

mongoose.connect(url,  {useNewUrlParser: true});

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if(newName && newNumber) {
  const newPerson = new Person({
    name: newName,
    number: newNumber
  });
  newPerson.save().then(result => {
    console.log('lisätään ' + newName + ' ' + newNumber + ' luetteloon');
    mongoose.connection.close();
  })
}
else {
  Person.find({}).then(result => {
    console.log('Puhelinluettelo: ')
    result.forEach(person => {
      console.log(person.name + " " + person.number);
    });
    mongoose.connection.close();
  });
}
