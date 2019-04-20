import gql from "graphql-tag";

export default gql`
{
  me {
    participations{
      event {
        _id
        title
        description
        availableSlots {
          startTime
          endTime
        }
        participations {
          user {
            name
          }
        }
      }
    }
  }
  
}`;