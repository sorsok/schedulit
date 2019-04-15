const GraphQLJSON = require('graphql-type-json');
const { GraphQLDateTime } = require('graphql-iso-date');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} = require('graphql');

const { User } = require('../database/models');

const TimeSlotType = new GraphQLObjectType({
  name: 'TimeSlot',
  fields: {
    startTime: { type: GraphQLDateTime },
    endTime: { type: GraphQLDateTime }
  }
});

const ParticipationType = new GraphQLObjectType({
  name: 'Participation',
  fields: {
    _id: { type: GraphQLString },
    userId: { type: GraphQLString },
    eventId: { type: GraphQLString },
    unavailable: { type: GraphQLBoolean },
    timeAvailable: { type: new GraphQLList(TimeSlotType) }
  }
});

const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: {
    _id: { type: GraphQLString },
    creatorId: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    availableSlots: { type: new GraphQLList(TimeSlotType) },
    participations: { type: new GraphQLList(ParticipationType) },
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: { type: GraphQLString },
    googleProfile: { type: GraphQLJSON },
    eventsCreated: { type: new GraphQLList(EventType) },
    eventsJoined: { type: new GraphQLList(EventType) }
  }
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return User.findOne();
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
