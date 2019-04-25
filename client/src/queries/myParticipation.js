import gql from 'graphql-tag';

export default gql`
query MyParticipation($eventId: String){
  myParticipation(eventId:$eventId){
    _id
    user{
      given_name
    }
    event{
      _id
      availableSlots{
        startTime
        endTime
      }
    }
    unavailable
    timeAvailable{
      startTime
      endTime
    }
  }
}
`;