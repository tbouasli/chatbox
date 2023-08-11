import { DocumentReference } from "firebase/firestore";

interface IndexProps {
  id: string;
  ref: DocumentReference;
}

export class Index implements IndexProps {
  id: string;
  ref: DocumentReference;

  constructor(props: IndexProps) {
    this.id = props.id;
    this.ref = props.ref;
  }
}
