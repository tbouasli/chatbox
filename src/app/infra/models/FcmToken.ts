interface FcmTokenProps {
    id: string;
    token: string;
    timestamp: string;
}

export class FcmToken implements FcmTokenProps {
    id: string;
    token: string;
    timestamp: string;

    constructor(props: FcmTokenProps) {
        this.id = props.id;
        this.token = props.token;
        this.timestamp = props.timestamp;
    }
}
