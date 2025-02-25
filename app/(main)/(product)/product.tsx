import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import React from 'react';
import { useEffect } from 'react';
import { ScrollView, View ,StyleSheet,Text} from 'react-native';
import { WebView } from "react-native-webview"; // ✅ ใช้ WebView

export default function ProductScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
          title: 'www.tpipolene.com',
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
          headerStyle: {
            backgroundColor: '#3399FF'
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        });
    },[navigation]);

    return (
      <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.webContainer}>
              <WebView 
                  source={{ uri: "https://www.tpipolene.com" }} 
                  style={styles.webView}
              />
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
    webContainer: {
        width: "100%",
        height: "100%", // ✅ WebView สูงพอดีจอ

        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 10,
    },
    webView: {
        flex: 1,
    }
    
});
