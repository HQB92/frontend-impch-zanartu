import { useState, useEffect } from 'react';

export function useUser() {
    const [user, setUser] = useState(() => {
        // Inicializa el estado con el valor de localStorage
        const data = JSON.parse(window.localStorage.getItem('user'));
        return data || {};
    });

    useEffect(() => {
        const data = JSON.parse(window.localStorage.getItem('user'));
        if (data) {
            setUser(data);
        }
    }, []); // Solo ejecuta una vez cuando el componente se monta

    return user;
}
