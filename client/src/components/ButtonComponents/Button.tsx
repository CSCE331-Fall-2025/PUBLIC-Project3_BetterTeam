import { type MouseEvent } from 'react';
import './Button.css';

interface ButtonProps {
  name: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
}

function Button({ name, onClick, disabled = false, className = '' }: ButtonProps) {
  return (
    <button
      id={name}
      className={`app-button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
}

export default Button;
