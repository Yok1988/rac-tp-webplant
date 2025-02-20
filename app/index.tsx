import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator, Text } from "react-native";
import { useNavigation } from "expo-router";

export default function Index() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    
    useEffect(() => {
        navigation.setOptions({ headerShown: false });
        const checkLogin = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                console.log("🔍 Token ที่อ่านได้:", token); // ✅ Debug Token

                if (token) {
                    router.replace("/(tabs)"); // ✅ ไปที่หน้า Home
                } else {
                    router.replace("/(auth)/login"); // ❌ ไม่มี Token ไป Login
                }
            } catch (error) {
                console.error("❌ Error อ่าน Token:", error);
            } finally {
                setLoading(false);
            }
        };

        checkLogin();
    }, [navigation]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
                <Text>กำลังโหลดข้อมูล...</Text>
            </View>
        );
    }

    return null; // ✅ ป้องกันปัญหา Render ค้าง
}

