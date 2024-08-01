import React, { useState, useEffect } from 'react';

export const useRoles = () => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const storedRoles = JSON.parse(window.localStorage.getItem('user')) || [];
        setRoles(storedRoles.roles);
    }, []);
    console.log(roles);

    return roles;
};
