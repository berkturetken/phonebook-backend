const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Person's name is required"],
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    // Accepted forms for the phone number
    /*
      -> if it has no dashes (i.e., "-") and at least 8 digits
      -> if it has one dash and total number of digits are at least 8 (dash is not included!)
    */
    validate: {
      validator: (v) => {
        return /^\d+$|(^\d{2}-\d{6})|(^\d{3}-\d{5})/.test(v);
        //
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "Person's phone number is required"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
