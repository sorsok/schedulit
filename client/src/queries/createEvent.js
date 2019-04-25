import gql from "graphql-tag";

export default gql`
mutation CreateEvent($event: InputEvent){
  createEvent(event: $event) {
    _id
  }
}
`;

