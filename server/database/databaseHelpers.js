const { User, Event, Participation, ObjectId } = require('./models');

module.exports = {
  fetchUser: id => {
    return User.findOne({ id });
  },
  fetchEvent: id => {
    return Event.findOne({ id });
  },
  createEvent: event => {
    const newEvent = new Event(event);
    return newEvent.save().then(newEvent => {
      return User.findOneAndUpdate(
        { id: newEvent.creatorId },
        { $push: { eventsCreated: newEvent.id } }
      ).then(() => {
        return newEvent;
      });
    });
  },
  fetchParticipation: id => {
    id = new ObjectId(id);
    return Participation.findOne({ id });
  },
  updateParticipation: (userId, eventId, participation) => {
    eventId = new ObjectId(eventId);
    return Participation.findOneAndUpdate({ userId, eventId }, participation);
  },
  createParticipation: (userId, eventId) => {
    eventId = new ObjectId(eventId);
    return Participation.findOne({ userId, eventId })
      .then((participation) => {
        if (participation) {
          return true;
        } else {
          let newParticipation = new Participation({ userId, eventId });
          newParticipation.save()
            .then((participation) => {
              return Event.findOneAndUpdate({ id: eventId }, { $addToSet: { participations: participation.id, participants: userId } })
            });
        }
      })
      .then(() => {
        return User.findOneAndUpdate({ id: userId, eventsCreated :{$nin: eventId} }, { $addToSet: { eventsJoined: eventId } })
      });
  }
};
