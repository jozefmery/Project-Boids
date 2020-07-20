/**
 * File: hooks/forceUpdate.ts
 * 
 * Author: Jozef Méry <xmeryj00@stud.fit.vutbr.cz>
 * Date: 17.5.2020
 * License: none
 * Description: Simple hook to force component re-rendering.
 * 
 */

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