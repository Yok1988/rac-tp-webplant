import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View, ScrollView ,Text} from 'react-native';
import { WebView } from "react-native-webview"; // ✅ ใช้ WebView


export default function HelpScreen() {
const navigation = useNavigation(); //  แฮมเบอร์กอร์

  useEffect(()=> {
    navigation.setOptions({
      title: 'ความช่วยเหลือ',
      headerShown:true,
      headerLeft:() => ( <MaterialIcons.Button name= "menu" backgroundColor ="#3399FF" onPress={ ()=>{navigation.dispatch(DrawerActions.openDrawer())} } />),
      headerStyle : { backgroundColor : "#3399FF"},
      headerTintColor : 'white',
      headerTitleStyle : {fontWeight :'bold'}
    });
  },[navigation]
  );
  
  // return (
  //   <View style={styles.container}>
  //      <Text style={styles.text}>👨🏻‍💻Help Screen</Text>
  //   </View>
  // );
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.webContainer}>
            <WebView 
                source={{ uri: "https://www.tpipolene.com/static/help/faq" }} 
                style={styles.webView}
            />
        </View>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
    container: {flex: 1,justifyContent: 'center', alignItems: 'center',backgroundColor: 'white'},
    text: {fontSize: 40,color: '#3399FF'},
    webContainer: {
      width: "100%",
      height: "100%", // ✅ WebView สูงพอดีจอ
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 10,
    },
    webView: {
        flex: 1,
    }
});