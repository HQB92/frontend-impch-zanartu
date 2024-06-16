import { useState } from 'react';
export function useUser() {
    const [user, setUser] = useState({});
    const data = window.sessionStorage.getItem('user');
    setUser(data);
    return data;
}


