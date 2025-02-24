import AppMenu from '@/components/AppMenu';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function MainLayout() {
    const queryClient = new QueryClient();
    const theme = {...DefaultTheme,colors: {...DefaultTheme.colors, primary: 'blue',secondary: 'yellow',},};

    return (
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
              {
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <Drawer drawerContent={(props) => <AppMenu {...props} />}>
                      <Drawer.Screen name="(tabs)" options={{headerShown: false}} />
                      <Drawer.Screen name="(profile)" options={{headerShown: false}} />   
                      <Drawer.Screen name="(product)" options={{headerShown: false}} /> 
                      <Drawer.Screen name="(dashboard)" options={{headerShown: false}} />     
                      <Drawer.Screen name="(help)" options={{headerShown: false}} />   
                      <Drawer.Screen name="(setting)" options={{headerShown: false}} />
                      <Drawer.Screen name="(about)" options={{headerShown: false}} />          
                      <Drawer.Screen name="+not-found" />       
                    </Drawer>
                  </GestureHandlerRootView>
              }
              <StatusBar style="auto" />
          </PaperProvider>
        </QueryClientProvider>
      );
}