import gql from "graphql-tag";

export default gql`
mutation CreateParticipation($eventId: String){
  createParticipation(eventId: $eventId){
    _id
    event {
      _id
      title
      description
    }
  }
}
`;