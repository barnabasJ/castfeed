import React from 'react'
import { View, StyleProp, ViewStyle } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

const IconContainerStyles: StyleProp<ViewStyle> = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-evenly'
}

export const IconContainer: React.FunctionComponent<{}> = ({ children }) => {
  return (
    <View style={IconContainerStyles}>
      {children}
    </View>
  )
}

export enum IconSize {
  small,
  medium,
  large
}

const sizeMap = {
  [IconSize.small]: 20,
  [IconSize.medium]: 25,
  [IconSize.large]: 30
}

export const Icon: React.FunctionComponent<{name: string, size: IconSize, color: string}> = ({ name, size, color }) => {
  return (
    <MaterialIcons
      name={name}
      size={sizeMap[size]}
      color={color}/>
  )
}
