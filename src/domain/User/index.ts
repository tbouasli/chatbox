import { v4 as UUID } from "uuid";

interface UserProps {
  id?: string;
  displayName: string;
  photoURL: string;
}

export default class User {
  private readonly _id: string;
  private _displayName: string;
  private _photoURL: string;

  constructor(props: UserProps) {
    this._id = props.id ?? UUID();
    this._displayName = props.displayName;
    this._photoURL = props.photoURL;
  }

  get id(): string {
    return this._id;
  }

  get displayName(): string {
    return this._displayName;
  }

  get photoURL(): string {
    return this._photoURL;
  }
}
