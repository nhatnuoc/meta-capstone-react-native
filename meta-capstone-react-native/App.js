import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useMemo, useReducer } from 'react';
import { Image, StyleSheet } from 'react-native';
import Profile from './screens/Profile';
import Onboarding, { AuthContext } from './screens/Onboarding';
import Home from './screens/Home';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import UserAvatar from './screens/Avatar';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Karla': require('./assets/Karla-Regular.ttf'),
    'MarkaziText': require('./assets/MarkaziText-Regular.ttf')
  });
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
      await AsyncStorage.multiSet([
        ['name', name],
        ['email', email],
        ['orderStatusesChecked', true],
        ['passwordChangedChecked', true],
        ['specialOffersChecked', true],
        ['newsletterChecked', true]
      ])
      dispatch({ type: 'SIGN_IN', name, email });
    },
    saveProfile: {
      
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
            <Stack.Screen name='Home' component={Home} options={({ navigation }) => ({
              headerTitle: (props) => <Image source={require('./assets/Logo.png')}/>,
              headerRight: (props) => <Button children={<Image source={require('./assets/Profile.png')} style={{width: 35, height: 35}}/>} onPress={() => {
                navigation.navigate('Profile');
              }}/>
            })}/>
            <Stack.Screen name='Profile' component={Profile} options={({ navigation }) => ({
              headerTitle: (props) => <Image source={require('./assets/Logo.png')}/>,
              headerRight: (props) => <UserAvatar size={35}/>,
            })}/>
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
