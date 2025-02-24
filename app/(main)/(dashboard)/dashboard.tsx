import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getSalesOrderHCService } from '@/services/sales-service';
export default function DashboardScreen() {

  const navigation = useNavigation(); //  แฮมเบอร์กอร์
   // Fetch sales data
    const { data } = useQuery({
       queryKey: ['salesDatHCAx'],
       queryFn: async () => {
         const response = await getSalesOrderHCService();
         return response.data;
       },
     });  
     
 useEffect(()=> {
    navigation.setOptions({
      title: 'Dashboard',headerShown:true,
      headerLeft:() => ( <MaterialIcons.Button name= "menu" backgroundColor ="#3399FF" onPress={ ()=>{navigation.dispatch(DrawerActions.openDrawer())} } />),
      headerStyle : { backgroundColor : "#3399FF"},
      headerTintColor : 'white',
      headerTitleStyle : {fontWeight :'bold'}
    });
  },[navigation]
  );
  
  return (
    <View style={styles.container}>
       <Text style={styles.text}>👨🏻‍💻Dashboard</Text>
    </View>
  );

}

const styles = StyleSheet.create({
    container: {flex: 1,justifyContent: 'center', alignItems: 'center',backgroundColor: 'white'},
    text: {fontSize: 40,color: '#3399FF'},
}); 