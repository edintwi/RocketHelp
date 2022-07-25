import React, {useState} from 'react';
import {Alert} from 'react-native';
import { VStack, Heading, Icon , useTheme} from 'native-base';
import {Envelope, Key} from 'phosphor-react-native';

import auth from '@react-native-firebase/auth'


import Logo from '../assets/logo_primary.svg';
import {Input} from '../components/Input';
import { Button } from '../components/Button';



export function SingIn (){

    const [isLoading, setIsloding] = useState(false);
    const [email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    const {colors} = useTheme();    

    function handleSingin(){
        if(!email || !password){
            return Alert.alert('Entrar','Prencha todos os campos!');
        }

        setIsloding(true);
        
        auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) =>{
            console.log(error.code);

            setIsloding(false);

            if(error.code === 'auth/invalid-email'){
                return Alert.alert('Entrar', 'E-mail inválido.');
            }
            if(error.code === 'auth/user-not-found'){
                return Alert.alert('Entrar', 'E-mail ou senha inválido.');
            }
            if(error.code === 'auth/wrong-password'){
                return Alert.alert('Entrar', 'E-mail ou senha inválido.');
            }

            return Alert.alert('Não foi possivel acessar');
        });
    }
    return (
        <VStack flex={1} alignItems={'center'} bg={'gray.600'} px={8} pt={24}>
                <Logo/>
            
            <Heading color={'gray.100'} fontSize='xl' mt={20} mb={6}>
                Acesse sua conta
                
            </Heading>
            <Input 
                placeholder = {'E-mail'}
                mb = {4}
                InputLeftElement = {<Icon as = { <Envelope color= {colors.gray[300]} /> } ml={4} />}
                onChangeText = {setEmail}
            />
            <Input 
                mb = {8}
                placeholder = {'Senha'} 
                InputLeftElement = {<Icon as = { <Key color= {colors.gray[300]} />} ml={4} />}
                secureTextEntry
                onChangeText={setPassword}
                />
            <Button
                onPress={handleSingin}
                isLoading={isLoading}
                title='Entrar'
                w = 'full'

                />
               
        </VStack>
    );
}