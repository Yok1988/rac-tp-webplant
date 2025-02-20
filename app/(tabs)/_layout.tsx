import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Platform } from "react-native";

const queryClient = new QueryClient();

export default function TabsLayout() {
    const colorScheme = useColorScheme();
    return (
            <QueryClientProvider client={queryClient}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    tabBarBackground: TabBarBackground,
                    tabBarStyle: Platform.select({
                    ios: {
                    // Use a transparent background on iOS to show the blur effect
                    position: 'absolute',
                    },
                    default: {},
                    }),
                }}>

                <Tabs.Screen
                    name="index"
                    options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="sales-erp"
                    options={{
                    title: 'Sales',
                    tabBarIcon: ({ color }) => <Ionicons name ="download-sharp" size={28} color={color} />,
                    }}
                />  
                <Tabs.Screen
                    name="sales"
                    options={{
                    title: 'SalesOrders',
                    tabBarIcon: ({ color }) => <Ionicons name ="cart" size={28} color={color} />,
                    }}
                    />  
                </Tabs>  

            </QueryClientProvider>
    );
}

///====================================
// import { Tabs } from 'expo-router';
// import React from 'react';
// import { Platform } from 'react-native';
// import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import TabBarBackground from '@/components/ui/TabBarBackground';
// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { Ionicons } from '@expo/vector-icons';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//         tabBarButton: HapticTab,
//         tabBarBackground: TabBarBackground,
//         tabBarStyle: Platform.select({
//           ios: {
//             // Use a transparent background on iOS to show the blur effect
//             position: 'absolute',
//           },
//           default: {},
//         }),
//       }}>
        
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="sales-erp"
//         options={{
//           title: 'Sales',
//           tabBarIcon: ({ color }) => <Ionicons name ="download-sharp" size={28} color={color} />,
//         }}
//       />  
//        <Tabs.Screen
//         name="sales"
//         options={{
//           title: 'SalesOrders',
//           tabBarIcon: ({ color }) => <Ionicons name ="cart" size={28} color={color} />,
//         }}
//       />  
//     </Tabs>  
//   ); 
// }
