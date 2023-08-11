import { v4 as UUID } from "uuid";
import User from "../User";
import Message from "../Message";

interface ChatProps {
  id?: string;
  members: User[];
  messages: Message[];
}

export default class Chat {
  private readonly _id: string;
  private _members: User[];
  private _messages: Message[];

  constructor(props: ChatProps) {
    this._id = props.id ?? UUID();
    this._members = props.members;
    this._messages = props.messages;
  }

  get id(): string {
    return this._id;
  }

  get members(): User[] {
    return this._members;
  }

  get messages(): Message[] {
    return this._messages;
  }
}
