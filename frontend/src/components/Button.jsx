import clsx from 'clsx';

const Button = ({ variant = 'primary', className, children, ...props }) => {
  return (
    <button className={clsx(variant === 'primary' ? 'btn-primary' : 'btn-secondary', className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
