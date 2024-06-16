import { useState } from 'react';
export function useUser() {
    const [user, setUser] = useState({});
    const data = window.sessionStorage.getItem('user');
    setUser(data);
    console.log("data",data);
    console.log("user",user);
    return data;
}


