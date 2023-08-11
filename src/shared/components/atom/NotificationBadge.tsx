interface NotificationBadgeProps {
  count: number;
}

function NotificationBadge({ count }: NotificationBadgeProps) {
  const displayableCount = count > 99 ? "99+" : count;

  return (
    <div className="h-4 w-4 grid place-items-center bg-primary rounded-full">
      <span className="text-xs">{displayableCount}</span>
    </div>
  );
}
export default NotificationBadge;
