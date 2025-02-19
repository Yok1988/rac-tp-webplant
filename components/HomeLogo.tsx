import React from 'react'
import { Image } from 'expo-image'
export default function HomeLogo() {
  return (
    <Image 
    source={{ uri: 'https://reactnative.dev/img/tiny_logo.png'}}
    style={{ width: 40,height: 40}}
    />
  )
}