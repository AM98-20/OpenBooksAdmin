import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function update({ navigation }) {
  const [ID, setIdAutor] = useState(0);
  const [Autor, setNombreAutor] = useState("");
  const [autores = [], setAutores] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setIdAutor(0);
      setNombreAutor("");
      setAutores([]);

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
    }
    else {
      var token = usuario.token;
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/autor/actualizar', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            idautores: ID,
            nombreautor: Autor,
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
        console.error(error);
      }
    }
  };

  const eliminar = async () => {
    var usuario = (JSON.parse(await AsyncStorage.getItem('usuario')));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado");
      //salir del app
    } else {
      var token = usuario.token;
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/autor/eliminar', {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            id: ID,
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
        console.error(error);
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
          setAutores(JSON.parse(await AsyncStorage.getItem('autores')));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const valueChanged = (value) => {
    setSelectedValue(value);
    setIdAutor(value);
    console.log(ID);
    console.log(selectedValue);
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>

        <View style={styles.containerDrop}>
          <Text style>
            Seleccione un autor
          </Text>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(value) => valueChanged(value)}>

            <Picker.Item label="Seleccionar" />
            {autores == [] ? (<Picker.Item />) : (
              autores.map((item, key) => {
                return (
                  <Picker.Item key={key} label={item.nombre_autor} value={item.idautores} />
                )
              })
            )
            }
          </Picker>
        </View>

        <TextInput value={Autor}
          onChangeText={setNombreAutor}
          style={styles.textinput} placeholder="Ingrese el Nombre del Autor:"
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