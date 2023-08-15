import { twMerge } from 'tailwind-merge';

interface UserImageProps extends Pick<React.ImgHTMLAttributes<HTMLImageElement>, 'className' | 'src' | 'alt' | 'height' | 'width'> {
    loading?: boolean;
}

function UserImage({ loading, className, ...props }: UserImageProps) {
    if (loading) {
        return (
            <div className={twMerge('rounded-full', className)}>
                <div className="animate-pulse bg-gray-300 rounded-full h-11 w-11" />
            </div>
        );
    }

    return <img className={twMerge('rounded-full', className)} height={44} width={44} {...props} referrerPolicy="no-referrer" />;
}
export default UserImage;
