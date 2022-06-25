import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
export default function registro({ navigation }) {

  const usrrole = 'ADMINS';

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setUsuario("");
      setNombre("");
      setApellido("");
      setMail("");
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []));

  const [usuario, setUsuario] = useState(null);
  const [password, setpassword] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [apellido, setApellido] = useState(null);
  const [mail, setMail] = useState(null);
  const guardar = async () => {
    var usuarioA = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuarioA) {
      console.log("Debe Escribir los datos completos");
      Alert.alert("OpenBooks", "Usuario no Autnticado.");

    } else if ((!mail || !usuario || !nombre || !apellido)){
      Alert.alert("OpenBooks", "Debes Escribir los datos completos");
    }
    else{
      var token = usuarioA.token;
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/usuario/guardar', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' +token
          },
          body: JSON.stringify({
            idusuarios: usuario,
            password: password,
            nombre_usuario: nombre,
            apellido_usuario: apellido,
            email: mail,
            rol: usrrole
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
          //navigation.goBack();
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
          <TextInput value={usuario}
            onChangeText={setUsuario}
            style={styles.textinput} placeholder="Ingrese un usuario."
            underlineColorAndroid={'transparent'} />
          <TextInput value={password}
            onChangeText={setpassword}
            style={styles.textinput} placeholder="Ingrese una Contraseña"
            secureTextEntry={true} underlineColorAndroid={'transparent'} />
          <TouchableOpacity style={styles.button} onPress={guardar}>
            <Text style={styles.btntext}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CAC3B2',
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
    borderBottomColor: '#BBB592',
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