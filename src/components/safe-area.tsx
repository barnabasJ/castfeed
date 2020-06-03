import React from 'react'
import { SafeAreaView, View, Platform, StatusBar } from 'react-native'

export const SafeArea: React.FunctionComponent = ({ children }) => {
  if (Platform.OS === 'android') {
    return (
      <View style={
        {
          paddingTop: StatusBar.currentHeight
        }
      }>
        {children}
      </View>
    )
  } else if (Platform.OS === 'ios') {
    return <SafeAreaView>{children}</SafeAreaView>
  } else {
    return <View>{children}</View>
  }
}

export default SafeArea
