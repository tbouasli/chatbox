import useAppData from "@/app/hooks/useAppData";
import NotificationBadge from "../atom/NotificationBadge";
import ListItem from "./ListItem";

function FriendRequests() {
  const { user } = useAppData();

  if (!user.data?.friendRequests?.length) return null;

  return (
    <ListItem className="py-4 border-y border-primary/40">
      <NotificationBadge count={user.data?.friendRequests?.length} />
      <span>Friend Requests</span>
    </ListItem>
  );
}
export default FriendRequests;
