export type FriendshipStatus = 'pending' | 'accepted' | 'rejected';

interface FriendshipProps {
    id: string;
    users: string[];
    status: FriendshipStatus;
    createdAt?: Date;
}

export class Friendship implements FriendshipProps {
    id: string;
    users: string[];
    status: FriendshipStatus;
    createdAt?: Date;

    private constructor(props: FriendshipProps) {
        this.id = props.id;
        this.users = props.users;
        this.status = props.status;
        this.createdAt = props.createdAt;
    }

    static existing(props: FriendshipProps): Friendship {
        return new Friendship(props);
    }

    /**
     * @throws {Error} If called directly
     * @deprecated Use the cloud function instead
     */
    static create(): Friendship {
        throw new Error('To create a friendship, rely on the cloud function');
    }
}
