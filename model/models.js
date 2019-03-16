const mongoose = require('mongoose');

const synthPresetSchema = mongoose.Schema({
	title: {type: String, required: true},
  designer: {type: String, require: true},
  envelope: {
    attack: {type: Number},
    decay: {type: Number},
    sustain: {type: Number},
    release: {type: Number}
  },
  portamento: {type: Number},
  volume: {type: Number},
  oscillators: [{
    type: {type: String},
    volume: {type: Number},
    width: {type: Number}
  }]
});

const Preset = mongoose.model("preset", synthPresetSchema);

module.exports = {Preset};
