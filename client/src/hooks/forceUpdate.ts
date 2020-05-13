// TODO header

import { useState, useEffect } from "react";

export function useForceUpdate(interval: number) {

    const [, setValue] = useState(false);
  
    useEffect(() => {

        const id = window.setInterval(() => setValue(value => !value), interval);
  
        return () => {
            
            window.clearInterval(id);
        };

    }, [interval]);
}