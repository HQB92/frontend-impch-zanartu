import { useState } from 'react';
export function useUser() {
    const [user, setUser] = useState({});
    const data = window.localStorage.getItem('user');
    setUser(data);
    return data;
}


