import classNames from 'clsx';

const LogoImage: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img
      src="https://agbhcntqmgbrrrtpymuw.supabase.co/storage/v1/object/public/logos/CollegeDAO_Logo_dark_1.svg"
      alt="CollegeDAO Logo"
      className={classNames(`w-[175px] sm:w-[190px]`, className)}
      width={105}
    />
  );
};

export default LogoImage;
