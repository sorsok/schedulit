const { mongoose } = require('./index');
const ObjectId = mongoose.Schema.Types.ObjectId;
let timeSlotSchema = mongoose.Schema({
  startTime: Date,
  endTime: Date,
});

let userSchema = mongoose.Schema({
  googleProfile: {
    type: Map,
    of: String
  },
  eventsCreated: { type: [{ type: ObjectId, ref: 'Event' }], default: [] },
  eventsJoined: { type: [{ type: ObjectId, ref: 'Event' }], default: [] }
});

let participationSchema = mongoose.Schema({
  userId: { type: ObjectId, ref: 'User' },
  eventId: { type: ObjectId, ref: 'Event' },
  unavailable: { type: Boolean, default: false },
  timeAvailable: [timeSlotSchema],
});

let eventSchema = mongoose.Schema({
  creatorId: { type: ObjectId, ref: 'User' },
  title: String,
  description: String,
  availableSlots: [timeSlotSchema],
  participations: { type: [{ type: ObjectId, ref: 'Participation' }], default: [] },
});


module.exports = {
  TimeSlot: mongoose.model('TimeSlot', timeSlotSchema),
  User: mongoose.model('User', userSchema),
  Participation: mongoose.model('Participation', participationSchema),
  Event: mongoose.model('Event', eventSchema),
  ObjectId: mongoose.Types.ObjectId
};

