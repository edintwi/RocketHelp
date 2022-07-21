import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes} from './App.routes';

import { SingIn } from '../screens/SingIn';

export function Routes(){
    return(
        <NavigationContainer>
            <AppRoutes/>
        </NavigationContainer>
    )
}