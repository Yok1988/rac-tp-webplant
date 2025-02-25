import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingScreen() {
  const navigation = useNavigation();
  const { language, setLanguage } = useLanguage(); // ใช้ Context

  useEffect(() => {
    navigation.setOptions({
      title: language === 'th' ? 'ตั้งค่า' : 'Settings',
      headerShown: true,
      headerLeft: () => (
        <MaterialIcons.Button
          name="menu"
          backgroundColor="#3399FF"
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        />
      ),
      headerStyle: { backgroundColor: '#3399FF' },
      headerTintColor: 'white',
      headerTitleStyle: { fontWeight: 'bold' },
    });
  }, [navigation, language]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{language === 'th' ? '🌐ตั้งค่า' : '🌐Settings'}</Text>     

      <TouchableOpacity
        style={styles.button}
        onPress={() => setLanguage(language === 'th' ? 'en' : 'th')}
      >
        <Text style={styles.buttonText}>
          {language === 'th' ? 'เปลี่ยนเป็นภาษาอังกฤษ' : 'Switch to Thai'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  text: { fontSize: 30, color: '#3399FF', marginBottom: 20 },
  button: { backgroundColor: '#3399FF', padding: 10, borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});


// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { DrawerActions } from '@react-navigation/native';
// import { useNavigation } from 'expo-router';

// export default function SettingScreen() {
//   const navigation = useNavigation();
//   const [language, setLanguage] = useState('th'); // ค่าเริ่มต้นเป็นภาษาไทย

//   useEffect(() => {
//     navigation.setOptions({
//       title: language === 'th' ? 'ตั้งค่า' : 'Settings',
//       headerShown: true,
//       headerLeft: () => (
//         <MaterialIcons.Button
//           name="menu"
//           backgroundColor="#3399FF"
//           onPress={() => {
//             navigation.dispatch(DrawerActions.openDrawer());
//           }}
//         />
//       ),
//       headerStyle: { backgroundColor: '#3399FF' },
//       headerTintColor: 'white',
//       headerTitleStyle: { fontWeight: 'bold' },
//     });
//   }, [navigation, language]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>
//         {language === 'th' ? '🛠️ ตั้งค่า' : '🛠️ Settings'}
//       </Text>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => setLanguage(language === 'th' ? 'en' : 'th')}
//       >
//         <Text style={styles.buttonText}>
//           {language === 'th' ? 'เปลี่ยนเป็นภาษาอังกฤษ' : 'Switch to Thai'}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
//   text: { fontSize: 30, color: '#3399FF', marginBottom: 20 },
//   button: { backgroundColor: '#3399FF', padding: 10, borderRadius: 5 },
//   buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
// });