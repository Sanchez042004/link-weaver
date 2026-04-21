import { useMemo } from 'react';

export const usePasswordValidation = (password: string) => {
    const isLengthValid = useMemo(() => password.length >= 8, [password]);
    const hasUppercase = useMemo(() => /[A-Z]/.test(password), [password]);
    const hasNumber = useMemo(() => /[0-9]/.test(password), [password]);
    const hasSpecialChar = useMemo(() => /[!@#$%^&*(),.?":{}|<>]/.test(password), [password]);

    const isValid = useMemo(() => 
        isLengthValid && hasUppercase && hasNumber && hasSpecialChar,
    [isLengthValid, hasUppercase, hasNumber, hasSpecialChar]);

    return {
        isLengthValid,
        hasUppercase,
        hasNumber,
        hasSpecialChar,
        isValid
    };
};
