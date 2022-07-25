import { useState, useEffect} from 'react';
import {Alert} from 'react-native';
import { VStack, Text, HStack, useTheme, ScrollView } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Header } from '../components/Header';
import {Order, OrderProps} from '../components/Order';
import { CardeDetails } from '../components/CardeDetails';

import {CircleWavyCheck, Hourglass, DesktopTower, Clipboard} from 'phosphor-react-native'

import firestore from '@react-native-firebase/firestore';
import {OrderFirestoreDTO} from '../DTOs/OrderDTO';
import { dateFormat } from '../utils/firestoreDateFormate';
import {Loading} from '../components/Loading';
import {Input} from '../components/Input';
import {Button} from '../components/Button';

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const {colors} = useTheme();
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const navigation = useNavigation();
  
  const route = useRoute();
  const {orderId} = route.params as RouteParams;
  
  function handleOrderClose(){
   if(!solution){
      return Alert.alert('Solicitação', 'Informe a solução para finalizar a solicitação');
   }
   firestore()
   .collection<OrderFirestoreDTO>('orders')
   .doc(orderId)
   .update({
    status: 'closed',
    solution,
    closed_at: firestore.FieldValue.serverTimestamp()
   })
   .then(() =>{
      Alert.alert('Solicitação', 'Solicitação encerrada.');
      navigation.goBack();
   })
   .catch((error) => {
      console.log(error);
      Alert.alert('Solicitação', 'Nâo foi possivel encerrar a solicitação.');
   })
  }

  useEffect(() =>{
    firestore()
    .collection <OrderFirestoreDTO>('orders')
    .doc(orderId)
    .get()
    .then(doc => {
      const {patrimony, description, status, created_at, closed_at, solution} = doc.data();

      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed

      });

      
      setIsLoading(false);

    });
  }, []);

  if(isLoading){
    return <Loading/>;
  }
  return (
    <VStack flex={1} bg={'gray.700'}>
        <Header title = {'Solicitação'}/>
        <HStack bg={'gray.400'} justifyContent={'center'} p={4}>
          {
            order.status === 'closed'
            ? <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
          }
          <Text 
            fontSize='sm'
            color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
            ml = {2}
            textTransform='uppercase'

          >
            {order.status === 'closed' ? 'Finalizado' : 'Em andamento' }
          </Text>
          

        </HStack>
        <ScrollView mx ={5} showsVerticalScrollIndicator={false}>
            <CardeDetails 
              title='Equipamento'
              description={`Patrimônio ${order.patrimony}`}
              icon ={ DesktopTower}
              footer = {order.when}
            />
            <CardeDetails 
              title='Descrição do Problema'
              description={order.description}
              icon ={ Clipboard}
            />
            <CardeDetails 
              title='Solução'
              description={order.solution }
              icon ={ CircleWavyCheck}
              footer = {order.closed && `Encerrado em ${order.closed}`}
            >
              { order.status == 'open' &&
              <Input
                placeholder='Descrição da Solução'
                onChangeText={setSolution}
                h={24}
                textAlignVertical = 'top'
                multiline
              />
              }
              
            </CardeDetails>
          </ScrollView>
          {
            order.status == 'open' && 
            <Button 
            onPress={handleOrderClose}
            title='Encerrar Solicitação'
            m={5}
            />
          }
    </VStack>
  );
}