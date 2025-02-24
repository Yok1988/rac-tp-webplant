import { useContext, useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { TextInput, Button, Card } from "react-native-paper";
import { loginService, loginInServiceToken } from "../../services/auth-service"; // ใช้ loginServiceToken ที่รับโทเค็น
import { useEffect } from "react";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthStoreContext } from "@/contexts/AuthContext";

export default function LoginScreen() {
    const router = useRouter();
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    const {onUpdateAuthData} = useContext(AuthStoreContext);
  
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    // const handleLogin = async () => {
    //     if (!userid.trim() || !password.trim()) {
    //         Alert.alert("⚠️", "Please enter User ID and Password");
    //         return;
    //     }
    //     if (password.length < 2) {
    //         alert("⚠️ Password must be at least 2 characters long.");
    //         return;
    //     }

    //     const res = await loginService(userid, password);
    //     if (res?.success) {
    //         console.log("✅ 🔓 ไปหน้าหลัก 🏠");
    //         router.replace("/(tabs)");
    //         alert(`🔓 Login Success! Welcome👏💖 ${res.Userid}`);
    //     } else {
    //         Alert.alert("❌ Login Failed", "Invalid credentials");
    //     }
    // };

    const onSubmit = async (useToken: boolean) => {
        if (!userid.trim() || !password.trim()) {
          alert("⚠️ กรุณากรอก User ID และ Password");
          return;
        }
      
        if (password.length < 2) {
          alert("⚠️ รหัสผ่านต้องมีอย่างน้อย 2 ตัวอักษร");
          return;
        }
      
        console.log("📡 ส่งข้อมูลไปที่ API:", { Userid: userid, Employeeid: password });
      
        const res = useToken
          ? await loginInServiceToken(userid, password)
          : await loginService(userid, password);
      
        console.log("📩 ได้รับค่าจาก API:", res);
      
        if (res?.success) {
          console.log("✅ ล็อกอินสำเร็จ");
          // update global isAuth is true
          
          //await onUpdateAuthData(); 

          router.replace("/(main)/(tabs)/(home)");
          console.log(`🎉 เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ${res.Userid}`);
          alert(`🎉 เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ${res.Userid}`);
          if (useToken) {
            console.log("💾 กำลังบันทึก Token:", res.token);
            await AsyncStorage.setItem("token", res.token);
            console.log("🔍 ตรวจสอบ Token:", await AsyncStorage.getItem("token"));
          }
        } else {
          Alert.alert("❌ Login Failed", "Invalid credentials");
        }
      };
      
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >            
            {/* โลโก้ตรงกลาง */}
            <Image source={require("@/assets/images/TPI-Polene-Logo.png")} style={styles.logo} />
            <Card style={styles.card}>
                <Card.Content>
                    <TextInput label="User ID" value={userid} onChangeText={setUserid} mode="outlined" />
                    <TextInput label="Password" secureTextEntry value={password} onChangeText={setPassword} mode="outlined" />
                    {/* <Button mode="contained" onPress={() => onSubmit(false)} style={[styles.button, { backgroundColor: '#3366FF'}]}>
                      LOGIN
                    </Button>
                    <Button mode="contained" onPress={() => onSubmit(true)}  style={[styles.button, { backgroundColor: '#3366FF'}]}> 
                      เข้าสู่ระบบ (ใช้ Token)
                    </Button> */}
                    <Button mode="contained" onPress={() => onSubmit(true)}  style={[styles.button, { backgroundColor: '#3366FF'}]}> 
                      Login 🔑
                    </Button>
                </Card.Content>
            </Card>   
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    logo: { width: 100, height: 100, marginBottom: 20 }, // ปรับขนาดโลโก้ได้
    card: { width: "90%", padding: 20 },
    button: { 
      marginTop: 10,
      width: 150,  // กำหนดความกว้าง
      height: 40,  // กำหนดความสูง
      left: 80,
      justifyContent: "center", // จัดให้อยู่ตรงกลางแนวตั้ง
      alignItems: "center", // จัดให้อยู่ตรงกลางแนวนอน
  }, 
});


function onUpdateAuthData() {
  throw new Error("Function not implemented.");
}
//npm install cors




//# No Token
// import { useState } from "react";
// import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, Image } from "react-native";
// import { useRouter } from "expo-router";
// import { TextInput, Button, Card } from "react-native-paper";
// import { loginService } from "../../services/auth-service";
// import { useEffect } from "react";
// import { useNavigation } from "expo-router";

// export default function LoginScreen() {
//     const router = useRouter();
//     const [userid, setUserid] = useState("");
//     const [password, setPassword] = useState("");

//     const navigation = useNavigation();

//     useEffect(() => {
//         navigation.setOptions({ headerShown: false });
//     }, [navigation]);


//     const handleLogin = async () => {
//         if (!userid.trim() || !password.trim()) {
//             Alert.alert("⚠️", "Please enter User ID and Password");
//             return;
//         }
//         if (password.length < 2) {
//             alert("⚠️ Password must be at least 2 characters long.");
//             return;
//         }

//         const res = await loginService(userid, password);
//         if (res?.success) {
//             console.log("✅ 🔓 ไปหน้าหลัก 🏠");
//             router.replace("/(tabs)");
//             alert(`🔓 Login Success! Welcome👏💖 ${res.Userid}`);
//         } else {
//             Alert.alert("❌ Login Failed", "Invalid credentials");
//         }
//     };

//     return (
//         <KeyboardAvoidingView
//             style={styles.container}
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//         >
//             {/* โลโก้ตรงกลาง */}
//             <Image source={require("@/assets/images/TPI-Polene-Logo.png")} style={styles.logo} />

//             <Card style={styles.card}>
//                 <Card.Content>
//                     <TextInput label="User ID" value={userid} onChangeText={setUserid} mode="outlined" />
//                     <TextInput label="Password" secureTextEntry value={password} onChangeText={setPassword} mode="outlined" />
//                     <Button mode="contained" onPress={handleLogin} style={styles.button}>LOGIN</Button>
//                 </Card.Content>
//             </Card>
//         </KeyboardAvoidingView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: "center", alignItems: "center" },
//     logo: { width: 150, height: 150, marginBottom: 20 }, // ปรับขนาดโลโก้ได้
//     card: { width: "90%", padding: 20 },
//     button: { marginTop: 10 },
// });
