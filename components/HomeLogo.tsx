import React from 'react'
import { Image } from 'expo-image'
import { StyleSheet} from "react-native";
export default function HomeLogo() {
  return (
    // <Image 
    // source={{ uri: 'https://reactnative.dev/img/tiny_logo.png'}}
    // style={{ width: 40,height: 40}}
    // />
    <Image source={require("@/assets/images/TPI-Polene-Logo.png")} style={styles.logo} />
  )
}

const styles = StyleSheet.create({
    logo: { width: 50, height: 50, marginBottom: 5 }// ปรับขนาดโลโก้ได้
});