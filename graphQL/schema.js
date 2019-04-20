const GraphQLJSON = require('graphql-type-json');
const { GraphQLDateTime } = require('graphql-iso-date');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} = require('graphql');

const { User, Participation, Event } = require('../database/models');

const TimeSlotType = new GraphQLObjectType({
  name: 'TimeSlot',
  fields: {
    startTime: { type: GraphQLDateTime },
    endTime: { type: GraphQLDateTime }
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
        console.log("participation", parentValue);
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
    }
  }
});


const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    hello: {
      type: GraphQLString,
      args: {
        x: { type: GraphQLString }
      },
      resolve: (_, { x }, req) => {
        return x + '!';
      }
    }
  }
});


module.exports.schema = new GraphQLSchema({ query: RootQueryType, mutation: mutationType });
