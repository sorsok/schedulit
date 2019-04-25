import gql from "graphql-tag";

export default gql`
mutation CreateParticipation($eventId: String){
  createParticipation(eventId: $eventId){
    event {
      _id
      title
      description
      availableSlots{
        startTime
        endTime
      }
    }
  }
}
`;