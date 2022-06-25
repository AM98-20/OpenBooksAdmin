
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Actualizar({ navigation }) {
  const [genero, setGenero] = useState("");
  const [generoid, setIdGenero] = useState(0);
  const [selectedvalue, setSelectedvalue] = useState("");
  const [generos, setGeneros] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      setIdGenero(0);
      setGenero("");
      setGeneros([]);

      cargarDatos();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []));

  const actualizar = async () => {
    var usuario = (JSON.parse(await AsyncStorage.getItem('usuario')));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado");
      //salir del app
    } else if (!generoid || !genero) {
      Alert.alert("OpenBooks", "Debes ingresar el nombre o seleccionar un genero.");
    }
    else {
      var token = usuario.token;
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/genero/actualizar', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            genero: genero,
            idgl: generoid,
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
  };

  const eliminar = async () => {
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado");
      navigation.navigate("Login");
    }else if (!generoid) {
      Alert.alert("OpenBooks", "Seleccione un genero.");
    }
    else {
      var token = usuario.token;
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/genero/eliminar', {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({
            idgl: generoid,
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
  };

  const cargarDatos = async () => {
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado");
    }
    else {
      var token = usuario.token;
      console.log('Bearer ' + token)
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
          setGeneros(JSON.parse(await AsyncStorage.getItem('generos')));
          //valueChanged(generos.idgl);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const valueChanged = (value) => {
    setSelectedvalue(value);
    setIdGenero(value);
    console.log(generoid);
    console.log(selectedvalue);
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>

        <View style={styles.containerDrop}>
          <Text style>
            Seleccione un genero
          </Text>
          <Picker
            selectedValue={selectedvalue}
            onValueChange={(value) => valueChanged(value)}>

            <Picker.Item label="Seleccionar" value='0' />
            {generos == [] ? (<Picker.Item />) : (
              generos.map((item, key) => {
                return (
                  <Picker.Item key={key} label={item.generos_literarios} value={item.idgl} />
                )
              })
            )
            }
          </Picker>
        </View>

        <TextInput value={genero}
          onChangeText={setGenero}
          style={styles.textinput} placeholder="Ingrese el Nombre del genero"
          underlineColorAndroid={'transparent'} />

        <TouchableOpacity style={styles.button} onPress={actualizar}>
          <Text style={styles.btntext}>Modificar Registro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={eliminar}>
          <Text style={styles.btntext}>Eliminar Registro</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#BBB592',
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
  },
  containerDrop: {
    flex: 2,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 8,
  },

});
