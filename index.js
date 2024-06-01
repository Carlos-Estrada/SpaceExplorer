import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StatusBar, View, Text, Image, ActivityIndicator } from 'react-native';
import DetailsScreen from './screens/DetailsScreen';
import { API_KEY } from '@env';

const HomeScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        let response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`);
        let data = await response.json();
        setPhoto(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAPOD();
  }, []);

  if (!photo) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{photo.title}</Text>
      <Image source={{ uri: photo.url }} style={{ width: 400, height: 400 }} resizeMode="contain" />
      <Text>{photo.explanation}</Text>
    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  if (!API_KEY) {
    console.error('API_KEY is not defined. Please check your environment variables.');
  }

  return (
    <ErrorBoundary>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome' }} />
            <Stack.Screen name="Details" component={DetailsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

export default App;