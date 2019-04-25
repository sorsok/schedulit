const { GraphQLDateTime } = require('graphql-iso-date');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLInputObjectType
} = require('graphql');

const { User, Participation, Event } = require('../database/models');

const TimeSlotType = new GraphQLObjectType({
  name: 'TimeSlot',
  fields: {
    startTime: {
      type: GraphQLDateTime,
    },
    endTime: {
      type: GraphQLDateTime,
    }
  }
});


const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    _id: { type: GraphQLString },
    creator: {
      type: UserType,
      resolve(parentValue, args) {
        return User.findOne({ _id: parentValue.creatorId })
      }
    },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    availableSlots: { type: new GraphQLList(TimeSlotType) },
    participations: {
      type: new GraphQLList(ParticipationType),
      resolve(parentValue, args) {
        return Participation.find({ _id: { $in: parentValue.participations } });
      }
    },
  })
});

const ParticipationType = new GraphQLObjectType({
  name: 'Participation',
  fields: () => ({
    _id: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parentValue, args) {
        return User.findOne({ _id: parentValue.userId })
      }
    },
    event: {
      type: EventType,
      resolve(parentValue, args) {
        return Event.findOne({ _id: parentValue.eventId })
      }
    },
    unavailable: { type: GraphQLBoolean },
    timeAvailable: { type: new GraphQLList(TimeSlotType) }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: { type: GraphQLString },
    sub: { type: GraphQLString },
    name: { type: GraphQLString },
    given_name: { type: GraphQLString },
    family_name: { type: GraphQLString },
    profile: { type: GraphQLString },
    picture: { type: GraphQLString },
    locale: { type: GraphQLString },
    participations: {
      type: new GraphQLList(ParticipationType),
      resolve(parentValue, args) {
        return Participation.find({
          _id: { $in: parentValue.participations }
        });
      }
    }
  })
});


const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    me: {
      type: UserType,
      resolve(parentValue, args, req) {
        return User.findOne({ _id: req.user._id });
      }
    },
    myParticipation: {
      type: ParticipationType,
      args: {
        eventId: {
          type: GraphQLString
        }
      },
      resolve(parentValue, { eventId }, req) {
        return Participation.findOne({ userId: req.user._id, eventId });
      }
    },
    otherParticipations: {
      type: new GraphQLList(ParticipationType),
      args: {
        eventId: {
          type: GraphQLString
        }
      },
      resolve(parentValue, { eventId }, req) {
        return Participation.find({ eventId, userId: { $ne: req.user._id } });
      }
    }
  }
});

const InputTimeSlotType = new GraphQLInputObjectType({
  name: 'InputTimeSlot',
  fields: {
    startTime: { type: GraphQLDateTime },
    endTime: { type: GraphQLDateTime }
  }
});

const InputParticipationType = new GraphQLInputObjectType({
  name: 'InputParticipation',
  fields: () => ({
    eventId: { type: GraphQLString, },
    unavailable: { type: GraphQLBoolean },
    timeAvailable: { type: new GraphQLList(InputTimeSlotType) }
  })
});

const InputEventType = new GraphQLInputObjectType({
  name: 'InputEvent',
  fields: () => ({
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    availableSlots: { type: new GraphQLList(InputTimeSlotType) },
    participants: { type: new GraphQLList(GraphQLString) }
  })
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    updateMyParticipation: {
      type: ParticipationType,
      args: {
        participation: { type: InputParticipationType }
      },
      resolve(parentValue, { participation }, req) {
        const userId = req.user._id;
        const { eventId } = participation;
        return Participation.findOneAndUpdate(
          { userId, eventId },
          participation,
          { new: true }
        );
      }
    },
    createParticipation: {
      type: ParticipationType,
      args: {
        eventId: { type: GraphQLString }
      },
      resolve: async (parentValue, { eventId }, req) => {
        const userId = req.user._id;
        const event = await Event.findOne({ _id: eventId });
        if (event) {
          const participation = await Participation.findOne({ userId, eventId });
          if (participation) {
            return participation
          } else {
            const newParticipation = new Participation({ userId, eventId });
            await User.findOneAndUpdate(
              { _id: userId },
              { $push: { participations: newParticipation._id } }
            );
            return newParticipation.save();
          }
        } else {
          console.log("event does not exist");
          return null;
        }
      }
    },
    createEvent: {
      type: EventType,
      args: {
        event: { type: InputEventType }
      },
      resolve(parentValue, { event }, req) {
        //create event document
        const userId = req.user._id;
        event.creatorId = userId;
        const newEvent = new Event(event);

        //create participation document
        const eventId = newEvent._id;
        const newParticipation = new Participation({
          userId,
          eventId,
          unavailable: false,
          timeAvailable: []
        });

        //add participation to event
        const participationId = newParticipation._id;
        newEvent.participations = [participationId];

        //update user and save new documents
        return User.findOneAndUpdate(
          { _id: userId },
          { $push: { participations: participationId } }
        )
          .then(() => newParticipation.save())
          .then(() => newEvent.save());
      }
    }
  }
});


module.exports.schema = new GraphQLSchema({ query: RootQueryType, mutation: MutationType });
