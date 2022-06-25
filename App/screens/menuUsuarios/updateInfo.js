import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, BackHandler } from 'react-native';

export default function registro({ navigation }) {

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setUsuario("");
      setNombre("");
      setApellido("");
      setMail("");
      cargarUsuario();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []));

  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [apellido, setApellido] = useState(null);
  const [mail, setMail] = useState(null);

  const cargarUsuario = async () => {
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    setUsuario(usuario.usuario.idusuarios);
    setNombre(usuario.usuario.nombe_usuario);
    setApellido(usuario.usuario.apellido_usuario);
    setMail(usuario.usuario.email);
  }

  const guardar = async () => {
    var usuarioA = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuarioA) {
      console.log("Debe Escribir los datos completos");
      Alert.alert("OpenBooks", "no autenticado.");

    } else {
      var token = usuarioA.token;
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/usuario/actualizar', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            id_usuario: usuario,
            nombre_usuario: nombre,
            apellido_usuario: apellido,
            email: mail
          })
        });
        const json = await response.json();
        console.log(json);
        if (json) {
          console.log(json.msj);
          Alert.alert("OpenBooks", json.msj);
        }
        else {
          Alert.alert("OpenBooks", json.msj);
          navigation.goBack();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.form}>
          <TextInput value={nombre}
            onChangeText={setNombre}
            style={styles.textinput}
            placeholder="Ingrese el Nombre"
            underlineColorAndroid={'transparent'} />
          <TextInput value={apellido}
            onChangeText={setApellido}
            style={styles.textinput} placeholder="Ingrese el Apellido"
            underlineColorAndroid={'transparent'} />
          <TextInput value={mail}
            onChangeText={setMail}
            style={styles.textinput} placeholder="Ingrese un Correo Electronico"
            underlineColorAndroid={'transparent'} />
          <TouchableOpacity style={styles.button} onPress={guardar}>
            <Text style={styles.btntext}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBB592',
  },
  body: {
    margin: 40,
    marginVertical: 10
  },
  header:
  {
    fontSize: 30,
    color: '#000',
    paddingBottom: 10,
    marginBottom: 40,
    borderBottomColor: '#199187',
    borderBottomWidth: 1,
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
    marginBottom: 50,
    color: '#000',
    borderBottomColor: '#CAC3B2',
    borderBottomWidth: 1,
  },
  button:
  {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#5F4B3B',
    marginTop: 10,
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