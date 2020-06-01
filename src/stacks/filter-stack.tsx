import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { FilterScreen } from 'src/screens/filter-screen'

const Stack = createStackNavigator()

export function FilterStack () {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Latest" component={FilterScreen}/>
    </Stack.Navigator>
  )
}

export default FilterStack
