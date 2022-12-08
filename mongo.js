const mongoose = require("mongoose");

const clArgumentLength = process.argv.length;

if (clArgumentLength < 3) {
  console.log(
    "Please provide the password, person's name and person's phone number as arguments: node mongo.js <password> <personName> <personPhoneNumber>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://full-stack:${password}@cluster0.3pbpeja.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Adding a new person
if (clArgumentLength === 5) {
  const personName = process.argv[3];
  const personPhoneNumber = process.argv[4];

  const Person = mongoose.model("Person", personSchema);

  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected");

      const person = new Person({
        name: personName,
        number: personPhoneNumber,
      });

      return person.save();
    })
    .then(() => {
      console.log(
        `added ${personName} number ${personPhoneNumber} to phonebook`
      );
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
// Displaying all of the entries in the phonebook
else if (clArgumentLength === 3) {
  const Person = mongoose.model("Person", personSchema);

  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected");

      return Person.find({});
    })
    .then((result) => {
      result.forEach((p) => {
        console.log(p);
      });
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
// Incorrect number of command-line (CL) arguments
else {
  console.log("incorrect number of CL arguments");
}
