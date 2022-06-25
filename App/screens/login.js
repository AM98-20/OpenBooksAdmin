import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default ({ navigation }) => {

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setUsuario(null);
      setpassword(null);

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []));

  const [usuario, setUsuario] = useState(null);
  const [password, setpassword] = useState(null);
  const [focusNombre, setFocusNombre] = useState(false);
  const presIniciarSesion = async () => {
    setUsuario(null);
    setpassword(null);
    if (!usuario || !password) {
      console.log("Debe Escribir los datos completos");
      Alert.alert("OpenBooks", "Debe Escribir los datos completos");
    }
    else {
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            usuario: usuario,
            password: password
          })
        });
        const json = await response.json();
        console.log(json);
        if (json.data.length == 0) {
          console.log(json.msj);
          Alert.alert("OpenBooks", json.msj);
        }
        else {
          const usuario = JSON.stringify(json.data);
          await AsyncStorage.setItem('usuario', usuario);
          if (json.data.usuario.rol == 'ADMINS') {
            console.log(json.msj);
            Alert.alert("OpenBooks", json.msj);
            navigation.navigate('Main');
          } else {
            Alert.alert('OpenBooks', 'No se puede acceder por conflicto de datos.');
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const passwordRef = useRef();
  const buttonRef = useRef();

  return (
    <View style={styles.body}>
      <View style={styles.header}>
        <Image source={require('../../assets/icon.png')} style={styles.img}></Image>
        <TextInput
          placeholderTextColor='#fdffe5'
          value={usuario}
          onChangeText={setUsuario}
          placeholder="Usuario o Correo"
          style={styles.Usuario}
          autoFocus={focusNombre}
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordRef.current.focus();
          }}
        >
        </TextInput>
        <TextInput
          placeholderTextColor='#fdffe5'
          value={password}
          onChangeText={setpassword}
          placeholder="Contraseña"
          style={styles.Contraseña}
          passwordRules=""
          secureTextEntry={true}
          ref={passwordRef}
          onSubmitEditing={() => {
            buttonRef.current.focus();
          }}
        >
        </TextInput>
        <TouchableOpacity ref={buttonRef} onSubmitEditing={() => presIniciarSesion} style={styles.Appbutton} onPress={presIniciarSesion}>
          <Text style={styles.AppbuttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Reset')}>
          <Text style={styles.reg}>¿Olvidaste tu Contraseña?</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C5679',
  },
  img: {
    width: 300,
    height: 300,
    top: -50,
  },
  Usuario: {
    color: '#FDFFE5',
    fontSize: 18,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    fontWeight: '600',
    paddingLeft: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#BBB592',
    paddingRight: 12,
    height: 50,
  },
  Contraseña: {
    color: '#FDFFE5',
    fontSize: 18,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    fontWeight: '600',
    paddingLeft: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#BBB592',
    paddingRight: 12,
    height: 50,

  },
  reg: {
    color: 'white',
    fontSize: 15,
    fontStyle: "italic",
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  Appbutton: {
    backgroundColor: '#808C5C',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginLeft: 50,
    marginTop: 20,
    width: 200,
    shadowColor: '#393E46',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.45,
  },
  AppbuttonText: {
    fontSize: 14,
    color: "#CAC3B2",
    alignSelf: "center",
    textTransform: "uppercase",
    fontWeight: 'bold',

  },
});