import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import CreateAccountScreen from '../Screens/Account/CreateAccountScreen'

export default function CreateAccountStack() {
	return (
		<Stack.Navigator>
		  <Stack.Screen
			name="Login"
			component={CreateAccountScreen}
			options={{ headerShown: false }}
		  />
		  <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
		</Stack.Navigator>
	)
}

const styles = StyleSheet.create({})
