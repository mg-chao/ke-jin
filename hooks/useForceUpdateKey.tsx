import { useState, useCallback } from "react";

const useForceUpdateKey: () => [number, () => void] = () => {
    const [key, setKey] = useState(0);

    const increaseKey = useCallback(() => {
        setKey((pre) => pre + 1);
    }, []);

    return [key, increaseKey];
};

export default useForceUpdateKey;
