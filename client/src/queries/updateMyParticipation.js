import gql from 'graphql-tag';

export default gql`
mutation UpdateMyParticipation($participation: InputParticipation){
  updateMyParticipation(participation:$participation){
    _id
    unavailable
    timeAvailable{
      startTime
      endTime
    }
  }
}
`;