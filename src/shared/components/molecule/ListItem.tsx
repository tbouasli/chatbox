import { twMerge } from 'tailwind-merge';

interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {}

function ListItem({ className, ...props }: ListItemProps) {
    return <div className={twMerge('flex items-center py-6 px-4 gap-2', className)} {...props} />;
}
export default ListItem;
