import gql from 'graphql-tag';

export default gql`
query MyParticipation($eventId: String){
  myParticipation(eventId:$eventId){
    _id
    user{
      _id
      given_name
    }
    event{
      _id
      availableSlots{
        startTime
        endTime
      }
      participations{
        _id
        user{
          _id
          name
        }
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