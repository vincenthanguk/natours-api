const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

// Data that is not in the schema does not get persisted
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required is a validator
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain letters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // enum validator works only on strings
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be above 1.0'],
      max: [5, 'A rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      // custom validator (not arrow function, bc this keyword is required)
      // validator needs to return boolean
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price; // false triggers validation error
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // permanently hide createdAt from the output
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  // OPTIONS
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL PROPERTIES
// not persisted in database, only shows up on get data
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DEFINING MONGOOSE MIDDLEWARE

// DOCUMENT MIDDLEWARE: runs before .save() and .create() (not update)
// "Pre save Hook/Middleware"
tourSchema.pre('save', function (next) {
  // within this middleware, you have access to the document (this)
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// hook: find
// RegEx to use hook all methods that start with 'find'
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  // this keyword points at query, not document
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
