interface UserProps {
    id: string;
    displayName: string;
    nickname: string;
    photoURL: string;
    fcmToken?: string;
}

export class User implements UserProps {
    id: string;
    displayName: string;
    nickname: string;
    photoURL: string;
    fcmToken?: string;

    constructor(props: UserProps) {
        this.id = props.id;
        this.displayName = props.displayName;
        this.nickname = props.nickname;
        this.photoURL = props.photoURL;
        this.fcmToken = props.fcmToken;
    }
}
