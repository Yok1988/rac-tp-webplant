import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "react-native-paper";
import { WebView } from "react-native-webview"; // ✅ ใช้ WebView

export default function HomeScreen() {
    const router = useRouter();

    const handleLogout = async () => {
        await AsyncStorage.removeItem("token");
        router.replace("/(auth)/login"); // ✅ กลับไปหน้า Login
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* ✅ Header */}
            {/* <View style={styles.header}>
                <Image 
                    source={require("@/assets/images/TPI-Polene-Logo.png")} 
                    style={styles.logo} 
                />
                <Text style={styles.welcomeText}>🏠 Welcome to TPLPL!</Text>
            </View> */}

            {/* ✅ WebView (ทำให้เลื่อนได้) */}
            <View style={styles.webContainer}>
                <WebView 
                    source={{ uri: "https://www.tpipolene.com" }} 
                    style={styles.webView}
                />
            </View>

            {/* ✅ Logout Button (เล็กลง) */}
            <View style={styles.buttonContainer}>
                <Button 
                    mode="contained" 
                    onPress={handleLogout} 
                    style={styles.logoutButton} 
                    labelStyle={styles.logoutLabel}
                >
                    Logout
                </Button>
            </View>
        </ScrollView>
    );
}

// ✅ Styles
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#F4F4F4",
        alignItems: "center",
        paddingBottom: 20,
    },
    header: {
        alignItems: "center",
        marginTop: 30,
        marginBottom: 15,
    },
    logo: {
        width: 50, // ✅ ปรับขนาดให้เล็กลง
        height: 50,
        resizeMode: "contain",
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    webContainer: {
        width: "100%",
        height: 700, // ✅ WebView สูงพอดีจอ
        //height: 600, // ✅ WebView สูงพอดีจอ
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 10,
    },
    webView: {
        flex: 1,
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 10, // ✅ ลดระยะห่าง
    },
    logoutButton: {
        width: "50%", // ✅ ทำให้ปุ่มเล็กลง
        paddingVertical: 5, // ✅ ปรับให้พอดี
        borderRadius: 8,
        backgroundColor: "#D32F2F",
        elevation: 3,
    },
    logoutLabel: {
        fontSize: 14, // ✅ ลดขนาดฟอนต์ลง
        fontWeight: "bold",
        color: "#FFF",
    },
});






// import { View, Text, Button } from "react-native";
// import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// export default function HomeScreen() {
//     const router = useRouter();

//     const handleLogout = async () => {
//         await AsyncStorage.removeItem("token");
//         router.replace("/(auth)/login"); // ✅ กลับไปหน้า Login
//     };
//     return (
//         <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//             <Text>🏠 Welcome to Home</Text>
//             <Button title="Logout" onPress={handleLogout} />
//         </View>
//     );
// }


////======================================
// import { Image, StyleSheet, Platform } from 'react-native';
// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { useNavigation } from 'expo-router'
// import { useEffect } from 'react'
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';//https://icons.expo.fyi/Index
// import { DrawerActions } from '@react-navigation/native';
// import HomeLogo from '@/components/HomeLogo';

// export default function HomeScreen() {

// const navigation = useNavigation();
//   useEffect(()=> {
//     navigation.setOptions({
//       //title: 'Home',
//       headerTitle:() => <HomeLogo/>,
//       headerTitleAlign:'center',
//       headerShown:true,
//       // headerLeft:() => (
//       // <MaterialIcons.Button name = "menu" backgroundColor = "#c31b1b"//"#9dc31b" //c31b1b
//       //   onPress={()=>{navigation.dispatch(DrawerActions.openDrawer()) } }/>
//       // ),
//       headerStyle : { backgroundColor : "#c31b1b"},
//       headerTintColor : 'white',
//       headerTitleStyle : {fontWeight :'bold' }
//     });
//   },[navigation]
//   );

//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={ <Image  source={require('@/assets/images/tp.jpg')} style={styles.reactLogo}/> }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome TPLPL!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginHorizontal: 16,
//     marginTop: 100,
//     backgroundColor: '#F9F9F9', // light background to contrast with header
//     padding: 16,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5, // for android shadow effect
//   },
//   titleText: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   reactLogo: {
//     height: 250,
//     width: 500,
//     //position: 'absolute',
//     //bottom: -30,
//     left: -40,
//     zIndex: 1,
//   },
// });








