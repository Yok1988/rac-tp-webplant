import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function Layout() {
    return (
        //<QueryClientProvider client={queryClient}>
        <Stack>
            {/* หน้าเริ่มต้น */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />  
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
        //</QueryClientProvider>
    );
}

  //<Stack.Screen name="(auth)/login" options={{ headerShown: false }} />

// import { Stack, useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { View, ActivityIndicator } from "react-native";

// export default function Layout() {
//     const router = useRouter();
//     const [loading, setLoading] = useState(true);
//     const [isAuthChecked, setIsAuthChecked] = useState(false);

//     useEffect(() => {
//         const checkLoginStatus = async () => {
//             try {
//                 const token = await AsyncStorage.getItem("token");
//                 console.log("🔍 Token ที่อ่านได้:", token); // ตรวจสอบค่าของ token

//                 if (token) {
//                     router.replace("/(tabs)"); // นำทางไปยังหน้า Home
//                 } else {
//                     router.replace("/(auth)/login"); // นำทางไปยังหน้า Login
//                 }
//             } catch (error) {
//                 console.error("❌ อ่าน Token ไม่ได้:", error);
//             } finally {
//                 setIsAuthChecked(true);
//                 setLoading(false);
//             }
//         };

//         checkLoginStatus();
//     }, [router]);

//     if (loading || !isAuthChecked) {
//         return (
//             <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//                 <ActivityIndicator size="large" />
//             </View>
//         );
//     }

//     return <Stack />; // ให้แน่ใจว่า Stack ถูกเรนเดอร์
// }
