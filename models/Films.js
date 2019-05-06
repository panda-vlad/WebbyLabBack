const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const FilmsSchema = new Schema({
  id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  release: {
    type: Number,
    required: true
  },
  format: {
    type: String,
    required: true
  },
  starting: [String]
}, { collation: { locale: 'uk'} });


const Films = mongoose.model('Films', FilmsSchema);

module.exports = Films;
