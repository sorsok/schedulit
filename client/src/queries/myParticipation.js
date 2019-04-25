import gql from 'graphql-tag';

export default gql`
query MyParticipation($eventId: String){
  myParticipation(eventId:$eventId){
    event{
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