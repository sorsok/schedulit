import gql from "graphql-tag";

export default gql`
{
  me {
    _id
    participations{
      _id
      event {
        _id
        title
        description
        availableSlots {
          startTime
          endTime
        }
        participations {
          _id
          user {
            _id
            name
          }
        }
      }
    }
  }
  
}`;