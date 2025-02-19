import { View } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper'

export default function AppLoading() {
  return (
    <View style = {{flex:1,justifyContent:'center',alignItems:'center'}} >
      <ActivityIndicator animating={true} size={50} />
    </View>
  )
}