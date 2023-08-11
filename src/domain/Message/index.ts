import { v4 as UUID } from "uuid";

interface MessageProps {
  id?: string;
  content: string;
  senderId: string;
  read: boolean;
  createdAt: Date;
}

export default class Message {
  private readonly _id: string;
  private _content: string;
  private _senderId: string;
  private _read: boolean;
  private _createdAt: Date;

  constructor(props: MessageProps) {
    this._id = props.id ?? UUID();
    this._content = props.content;
    this._senderId = props.senderId;
    this._read = props.read;
    this._createdAt = props.createdAt;
  }

  get id(): string {
    return this._id;
  }

  get content(): string {
    return this._content;
  }

  get senderId(): string {
    return this._senderId;
  }

  get read(): boolean {
    return this._read;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
