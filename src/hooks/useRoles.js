import { useState, useEffect } from 'react';

export const useRoles = () => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const storedRoles = JSON.parse(window.localStorage.getItem('user'))?.roles || [];
        setRoles(storedRoles);
    }, []);

    return roles;
};