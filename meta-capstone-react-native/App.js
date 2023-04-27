import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { createContext, useEffect, useMemo, useReducer, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Profile from './screens/Profile';
import Onboarding, { AuthContext } from './screens/Onboarding';
import Home from './screens/Home';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Karla': require('./assets/Karla-Regular.ttf'),
    'MarkaziText': require('./assets/MarkaziText-Regular.ttf')
  });
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            isOnboardingCompleted: true,
            name: action.name,
            email: action.email
          };
        case 'SIGN_OUT':
          return {
            isOnboardingCompleted: false,
            name: null, 
            email: null
          };
      }
    },
    {
      isOnboardingCompleted: false,
      name: null, 
      email: null
    }
  );
  useEffect(async () => {
    let name = await AsyncStorage.getItem('name');
    let email = await AsyncStorage.getItem('email');
    if (name && email && name !== "" && email !== "") {
      dispatch({ type: 'SIGN_IN', name, email });
    } else {
      dispatch({ type: 'SIGN_OUT' });
    }
  }, []);
  const authContext = useMemo(() => ({
    signIn: async (name, email) => {
      // In a production app, we need to send some data (usually username, password) to server and get a token
      // We will also need to handle errors if sign in failed
      // After getting token, we need to persist the token using `SecureStore`
      // In the example, we'll use a dummy token
      // await AsyncStorage.setItem('isOnboardingCompleted', true);
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('email', email);
      dispatch({ type: 'SIGN_IN', name, email });
    },
    signOut: async () => {
      await AsyncStorage.clear();
      dispatch({ type: 'SIGN_OUT' });
    },
  }));
  if (!fontsLoaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        <Stack.Navigator>
          {
            state.isOnboardingCompleted ?
            (
            <>
            <Stack.Screen name='Home' component={Home}/>
            <Stack.Screen name='Profile' component={Profile}/>
            </>
            )
            :
            (<Stack.Screen name='Onboarding' component={Onboarding} options={{
              headerTitle: (props) => <Image source={require('./assets/Logo.png')}/>
            }}/>)
          }
        </Stack.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
