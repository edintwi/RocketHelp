import React from 'react';
import { Center, Spinner} from "native-base"

export function Loading(){
    return(
        <Center>
            <Spinner flex={1} bg='gray.700' />
        </Center>
    );
        
    
}