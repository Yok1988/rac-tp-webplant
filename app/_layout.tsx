import AuthStoreProvider from "@/contexts/AuthContext";
import { Slot, Stack } from "expo-router";

export default function RootLayout() {
    return (
     <AuthStoreProvider>
        <Slot />
      </AuthStoreProvider>
        // <Stack>
        //     {/* หน้าเริ่มต้น */}
        //     <Stack.Screen name="(main)" options={{ headerShown: false }} />  
        //     <Stack.Screen name="(auth)" options={{ headerShown: false }} />  
        // </Stack>
    );
}


// import AppMenu from '@/components/AppMenu';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
// import { Drawer } from 'expo-router/drawer';
// import { StatusBar } from 'expo-status-bar';
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// export default function Layout() {
//     const queryClient = new QueryClient();
//     const theme = {...DefaultTheme,colors: {...DefaultTheme.colors, primary: 'blue',secondary: 'yellow',},};

//     return (
//         <QueryClientProvider client={queryClient}>
//           <PaperProvider theme={theme}>
//               {
//                   <GestureHandlerRootView style={{ flex: 1 }}>
//                     <Drawer drawerContent={(props) => <AppMenu {...props} />}>
//                       <Drawer.Screen name="(tabs)" options={{headerShown: false}} />
//                       <Drawer.Screen name="(product)" options={{headerShown: false}} />
//                       <Drawer.Screen name="+not-found" />
//                     </Drawer>
//                   </GestureHandlerRootView>
//               }
//               <StatusBar style="auto" />
//           </PaperProvider>
//         </QueryClientProvider>
//       );
// }

//======================
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
