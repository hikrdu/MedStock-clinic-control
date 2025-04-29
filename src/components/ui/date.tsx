import React, { FC } from "react";

interface DateInputProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateInput: FC<DateInputProps> = ({ value, onChange }) => {
    return (
        <div className="space-y-2">
            <Input
                id="expirationDate"
                name="expirationDate"
                type="text"
                value={value}
                onChange={onChange}
                placeholder="MM/yyyy"
            />
        </div>
    );
};



const Input: FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} />
);

export default DateInput;
