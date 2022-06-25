import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, useWindowDimensions, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Registro from './registro';
import UpdateInfo from './update';

export default function menu({ navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      cargarDatos();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []));

  const FirstRoute = () => (
    <Registro navigation={navigation} />
  );

  const SecondRoute = () => (
    <UpdateInfo navigation={navigation} />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const cargarDatos = async () => {
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado");
    }
    else {
      var token = usuario.token;
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/autor/listar', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          }
        });
        const json = await response.json();
        console.log(json);
        if (json.data.length == 0) {
          console.log(json.msj);
          Alert.alert("OpenBooks", json.msj);
        }
        else {
          const autores = JSON.stringify(json.data);
          await AsyncStorage.setItem('autores', autores);
        }
      } catch (error) {
        console.error(error);
      }
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/libro/lista', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          }
        });
        const json = await response.json();
        console.log(json);
        if (json.data.length == 0) {
          console.log(json.msj);
          Alert.alert("OpenBooks", json.msj);
        }
        else {
          const libros = JSON.stringify(json.data);
          await AsyncStorage.setItem('libros', libros);
        }
      } catch (error) {
        console.error(error);
      }
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/genero/listar', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          }
        });
        const json = await response.json();
        console.log(json);
        if (json.data.length == 0) {
          console.log(json.msj);
          Alert.alert("OpenBooks", json.msj);
        }
        else {
          const generos = JSON.stringify(json.data);
          await AsyncStorage.setItem('generos', generos);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Registro' },
    { key: 'second', title: 'Actualizacion' },
  ]);

  return (
    <View style={{ flex: 1, }}>
      <View style={styles.header}>
        <TouchableOpacity style={{ width: 50 }} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-circle-outline" size={40} />
        </TouchableOpacity>
        <Text style={styles.headerT}>Libros</Text>
      </View>
      <TabView style={{ flex: 5 }}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => <TabBar {...props} style={{ backgroundColor: 'black' }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header:
  {
    flex: 0.6,
    alignItems: 'center',
    backgroundColor: '#1C5679',
    fontSize: 30,
    color: '#000',
    borderBottomColor: '#199187',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 10
  },
  headerT:
  {
    fontSize: 30,
    color: '#000',
    alignSelf: 'center',
    alignContent: 'center',
  },
});