import { tw } from 'twind';

interface IButton {
  primary?: boolean;
  children: React.ReactNode;
  modifier?: string;
  onclick?: () => void
  disabled?: boolean

}

const Button = ({ primary, modifier, children, onclick, disabled, ...rest }: IButton) => {
  const baseStyle = `font-sans font-medium py-2 px-4 border rounded`;
  const styles = primary
    ? `bg-white text-black border-black hover:bg-black hover:text-white`
    : `bg-white text-gray-600 border-gray-300 hover:border-black hover:bg-gray-800`;

  return (
    <button type="button" onClick={onclick} disabled={disabled} className={tw(`${baseStyle} ${styles} ${modifier ?? ``}`)} {...rest}>
      {children}
    </button>
  );
};

export default Button;
