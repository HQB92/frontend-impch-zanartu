import React, { useState, useEffect } from 'react';

export const useChurch = () => {
    const [church, setChurch] = useState(null);

    useEffect(() => {
        const storedChurch = JSON.parse(window.localStorage.getItem('profile')) || null;
        setChurch(storedChurch.churchId);
    }, []);
    console.log(church);

    return church;
};
