import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { ImageBackground, Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Drawer } from 'react-native-paper'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { logoutService } from '@/services/auth-service'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppMenu(props: DrawerContentComponentProps) {
    const handleLogout = async () => {
        await AsyncStorage.removeItem("token");
        router.replace("/(auth)/login"); // ✅ กลับไปหน้า Login
    };

  return (
      <ScrollView>
        <ImageBackground 
            source={require('@/assets/images/tp.jpg')} //source={{uri: 'https://picsum.photos/180/180'}} 
            style={{width: '100%', height: 180, justifyContent: 'center', alignItems: 'center'}} >    
        </ImageBackground>

        <Drawer.Section title="เมนูหลัก">
          <Drawer.Item
            icon="home"
            label="หน้าแรก"
            right={() => <MaterialIcons name="keyboard-arrow-right" size={20} />}
            onPress={() => {
              props.navigation.navigate('(tabs)');
            }}
          />
          <Drawer.Item
            icon="account"
            label="โปรไฟล์"
            right={() => <MaterialIcons name="keyboard-arrow-right" size={20} />}
            onPress={() => {
              props.navigation.navigate('(profile)');
            }}
          />
          <Drawer.Item
            icon="chart-bar"
            label="แดชบอร์ด"
            right={() => <MaterialIcons name="keyboard-arrow-right" size={20} />}
            onPress={() => {
              props.navigation.navigate('(dashboard)');
            }}
          />
          <Drawer.Item
            icon="web"
            label="เข้าเว็บไซต์ TPIPL"
            right={() => <MaterialIcons name="keyboard-arrow-right" size={20} />}
            onPress={() => {
              props.navigation.navigate('(product)');
            }}
          />
           <Drawer.Item
            icon="message"
            label="ความช่วยเหลือ"
            right ={ () => <MaterialIcons name= "keyboard-arrow-right" size={20}/>}
            onPress={() => {props.navigation.navigate('(help)'); }}
          />
          <Drawer.Item
            icon="cog"
            label="การตั้งค่า"
            right ={ () => <MaterialIcons name= "keyboard-arrow-right" size={20}/>}
            onPress={() => {props.navigation.navigate('(setting)'); }}
          />
          <Drawer.Item
            icon="information"
            label="เกี่ยวกับ"
            right ={ () => <MaterialIcons name= "keyboard-arrow-right" size={20}/>}
            onPress={() => {props.navigation.navigate('(about)'); }}
          />
        </Drawer.Section>

        {/* <Drawer.Section title="ระบบ"> */}
          <Drawer.Item
            icon="logout"
            label="ออกจากระบบ"
            // right={() => <MaterialIcons name="keyboard-arrow-right" size={20} />}
            onPress={ async () => {
              await logoutService();
              handleLogout();
            }}
          />          
        {/* </Drawer.Section> */}
      </ScrollView>
  )
}