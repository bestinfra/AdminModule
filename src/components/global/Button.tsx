interface ButtonProps {
    label: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?:
        | 'primary'
        | 'secondary'
        | 'outline'
        | 'primarysmall'
        | 'success'
        | 'danger'
        | 'warning';
}

const Button = ({
    label,
    onClick,
    type = 'button',
    disabled = false,
    variant = 'primary',
}: ButtonProps) => {
    return (
        <button
            type={type}
            className={`button ${variant}`}
            onClick={onClick}
            disabled={disabled}>
            {label}
        </button>
    );
};

export default Button;
