import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes} from './App.routes';

import { Loading } from '../components/Loading';

import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth'

import { SingIn } from '../screens/SingIn';


export function Routes(){

    const [loading, setIsLoading] = useState(true);
    const[user, setUser] = useState <FirebaseAuthTypes.User>();
    
    useEffect(() => {
        const subscriber = auth()
        .onAuthStateChanged(reponse => {
            setUser(reponse);
            setIsLoading(false);
        });    
        return subscriber;
    },[]);

    if(loading){
        return <Loading/>
    }
    return(
        <NavigationContainer>
          { user ? <AppRoutes/> : <SingIn/>}
        </NavigationContainer>
    )
}