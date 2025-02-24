import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function ProfileScreen() {
const navigation = useNavigation(); //  แฮมเบอร์กอร์

  useEffect(()=> {
    navigation.setOptions({
      title: 'โปรไฟล์ รูปภาพ',headerShown:true,
      headerLeft:() => ( <MaterialIcons.Button name= "menu" backgroundColor ="#3399FF" onPress={ ()=>{navigation.dispatch(DrawerActions.openDrawer())} } />),
      headerStyle : { backgroundColor : "#3399FF"},
      headerTintColor : 'white',
      headerTitleStyle : {fontWeight :'bold'}
    });
  },[navigation]
  );
  
  return (
    <View style={styles.container}>
       <Text style={styles.text}>👨🏻‍💻Profile & โปรไฟล์ รูปภาพ</Text>
    </View>
  );

}

const styles = StyleSheet.create({
    container: {flex: 1,justifyContent: 'center', alignItems: 'center',backgroundColor: 'white'},
    text: {fontSize: 40,color: '#3399FF'},
});