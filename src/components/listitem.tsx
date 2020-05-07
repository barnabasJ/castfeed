import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'

const style = StyleSheet.create({
  container: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  edgeElement: {
    width: '20%',
    marginHorizontal: 10
  },
  centerElement: {
    width: '60%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
})

export interface IListItem {
  id: string
  title: string
  thumbUrl: string
}

export const ListItem: React.FunctionComponent<{
  item: IListItem
}> = ({ item }) => {
  return (
    <View style={style.container}>
      <View style={style.edgeElement}>
        <Image style={{ height: '100%', width: 'auto' }}source={{ uri: item.thumbUrl }} />
      </View>
      <View style={style.centerElement}>
        <Text >{item.title}</Text>
      </View>
    </View>
  )
}
