
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Registro({ navigation }) {
  const [genero, setGenero] = useState("");

  const guardar = async () => {
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado, se cerrara la sesion");
      navigation.navigate("Login");
    }
    else if (!genero) {
      console.log("Ingrese el genero");
      Alert.alert("OpenBooks", "Debes Escribir el genero");

    }
    else {
      var token = usuario.token;
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/genero/guardar', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            generos_literarios: genero,

          })
        });
          const json = await response.json();
          console.log(json);
          if (json.data.length == 0) {
            console.log(json.msj);
            Alert.alert("OpenBooks", json.msj);
          }
          else {
            Alert.alert("OpenBooks", json.msj);
            navigation.goBack();
          }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <TextInput value={genero}
          onChangeText={setGenero}
          style={styles.textinput} placeholder="Ingrese el Nombre del genero literario"
          underlineColorAndroid={'transparent'} />

        <TouchableOpacity style={styles.button} onPress={guardar}>
          <Text style={styles.btntext}>Crear Registro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CAC3B2',
    flex: 1
  },
  body: {
    margin: 40
  },
  header:
  {
    fontSize: 30,
    color: '#000',
    paddingBottom: 10,
    marginBottom: 40,
    borderBottomColor: '#FFFF',
    borderBottomWidth: 3,
    flexDirection: 'row',
  },
  headerT:
  {
    fontSize: 30,
    color: '#000',
    alignSelf: 'center',
    alignContent: 'center'
  },
  textinput:
  {
    alignSelf: 'stretch',
    height: 50,
    color: '#000',
    marginBottom: 50,
    borderBottomColor: '#FFFF',
    borderBottomWidth: 3,
  },

  button:
  {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#808C5C',
    marginTop: 30,
    borderRadius: 10,
    shadowColor: '#393E46',
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.45,
  }

});
