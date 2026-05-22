import { initials } from '../utils/format';

const Avatar = ({ user, size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  if (user?.avatar) {
    return <img src={user.avatar} alt={user.name} className={`${sizes[size]} rounded-full border border-line object-cover`} />;
  }

  return (
    <div className={`${sizes[size]} grid place-items-center rounded-full bg-brand/10 font-bold text-brand`}>
      {initials(user?.name)}
    </div>
  );
};

export default Avatar;
