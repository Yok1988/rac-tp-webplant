import { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { TextInput, Button, Card } from "react-native-paper";
import { loginService } from "../../services/auth-service";
import { useEffect } from "react";
import { useNavigation } from "expo-router";

export default function LoginScreen() {
    const router = useRouter();
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);


    const handleLogin = async () => {
        if (!userid.trim() || !password.trim()) {
            Alert.alert("⚠️", "Please enter User ID and Password");
            return;
        }
        if (password.length < 2) {
            alert("⚠️ Password must be at least 2 characters long.");
            return;
        }

        const res = await loginService(userid, password);
        if (res?.success) {
            console.log("✅ 🔓 ไปหน้าหลัก 🏠");
            router.replace("/(tabs)");
            alert(`🔓 Login Success! Welcome👏💖 ${res.Userid}`);
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
                    <Button mode="contained" onPress={handleLogin} style={styles.button}>LOGIN</Button>
                </Card.Content>
            </Card>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    logo: { width: 150, height: 150, marginBottom: 20 }, // ปรับขนาดโลโก้ได้
    card: { width: "90%", padding: 20 },
    button: { marginTop: 10 },
});
