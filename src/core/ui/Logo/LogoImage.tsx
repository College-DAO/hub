import classNames from 'clsx';
import Image from 'next/image';

const LogoImage: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Image
      src="https://agbhcntqmgbrrrtpymuw.supabase.co/storage/v1/object/public/logos/CollegeDAO_Logo_dark_1.svg"
      alt="CollegeDAO Logo"
      className={classNames(`w-[175px] sm:w-[190px]`, className)}
      width={190}
      height={105}
    />
  );
};

export default LogoImage;
