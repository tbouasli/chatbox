import { twMerge } from 'tailwind-merge';

interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {}

function ListItem({ className, ...props }: ListItemProps) {
    return <div className={twMerge('flex items-center py-6 px-4 gap-2 h-10 box-content overflow-hidden', className)} {...props} />;
}
export default ListItem;
