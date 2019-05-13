import gql from 'graphql-tag';

export default gql`
query OtherParticipations($eventId: String){
  otherParticipations(eventId:$eventId){
    _id
    user {
      given_name
    }
    unavailable
    timeAvailable{
      startTime
      endTime
    }
  }
}
`;