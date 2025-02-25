import { MaterialIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';

export default function ContactScreen() {
  const navigation = useNavigation();
  
  useEffect(()=> {
    navigation.setOptions({
      title: '📞 ติดต่อเรา',
      headerShown:true,
      headerLeft:() => ( <MaterialIcons.Button name= "menu" backgroundColor ="#3399FF" onPress={ ()=>{navigation.dispatch(DrawerActions.openDrawer())} } />),
      headerStyle : { backgroundColor : "#3399FF"},
      headerTintColor : 'white',
      headerTitleStyle : {fontWeight :'bold'}
    });
  },[navigation]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ติดต่อเรา</Text>
      <Text style={styles.company}>บริษัท ทีพีไอ โพลีน จำกัด (มหาชน)</Text>
      <Text style={styles.address}>อาคาร ทีพีไอ ทาวเวอร์</Text>
      <Text style={styles.address}>26/56 ถนนจันทน์ตัดใหม่</Text>
      <Text style={styles.address}>แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพฯ 10120</Text>
      <Text style={styles.header}>📞 Call Center</Text>
      <Text style={styles.phone}>02-285-5090</Text>
      <Text style={styles.info}>ตั้งแต่จันทร์-ศุกร์ เวลา 08.30 - 17.30 น.</Text>
      <Text style={styles.info}>เว้นวันหยุดนักขัตฤกษ์</Text>
      
      <View style={styles.contactContainer}>
        <FontAwesome name="phone" size={24} color="#3399FF" />
        <Text style={styles.contactText}> +662 2855090</Text>
      </View>
      
      <View style={styles.contactContainer}>
        <MaterialIcons name="email" size={24} color="#3399FF" />
        <Text style={styles.contactText}> support@tpipolene.co.th</Text>
      </View>
      
      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={() => Linking.openURL('https://page.line.me/ftk1356u?openQrModal=true')}>
          <FontAwesome5 name="line" size={30} color="#06C755" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/TPIPolene')}>
          <FontAwesome name="facebook" size={30} color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/tpipolene')}>
          <FontAwesome name="instagram" size={30} color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('//https://x.com/tpipl')}>
          <FontAwesome name="twitter" size={30} color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="youtube" size={30} color="#FF0000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3399FF',
    marginBottom: 10,
  },
  company: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  address: {
    fontSize: 16,
    color: '#555',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginTop: 20,
  },
  phone: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  info: { fontSize: 16, color: '#555', marginBottom: 5 },
  logo: { width: 50, height: 50, marginHorizontal: 10 },
});