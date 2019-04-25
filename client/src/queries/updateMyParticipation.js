import gql from 'graphql-tag';

export default gql`
mutation UpdateMyParticipation($participation: InputParticipation){
  updateMyParticipation(participation:$participation){
    _id
    userId
    eventId
    unavailable
    timeAvailable{
      startTime
      endTime
    }
  }
}
`;