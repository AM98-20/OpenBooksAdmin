import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function registro({ navigation }) {

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      setUsuarios([]);
      setSelectedValue("");
      setTempU([]);
      setUsuarioA("");
      setNombre("");
      setApellido("");
      setMail("");
      cargarUsuarios();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []));

  const [usuarios, setUsuarios] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [tempU, setTempU] = useState([]);
  const [usuarioA, setUsuarioA] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [mail, setMail] = useState("");

  const cargarUsuarios = async () => {
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado");
    }
    else {
      var token = usuario.token;
      console.log('Bearer ' + token)
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/usuario/listar', {
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
          const usuarios = JSON.stringify(json.data);
          await AsyncStorage.setItem('usuarios', usuarios);
          setUsuarios(JSON.parse(await AsyncStorage.getItem('usuarios')));
          //valueChanged(generos.idgl);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const verAlmacenamiento = async (value) => {
    valueChanged( value);
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado");
      navigation.navigate("Login");
    }
    else {
      var token = usuario.token;
      //console.log('Bearer ' + token)
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/usuario/mostrar', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            usuario: value,
          })
        });
        const json = await response.json();
        //console.log(json);
        if (json.lenght == 0) {
          Alert.alert("OpenBooks", json.msj);
        }
        else {
          const temp = JSON.stringify(json.data)
          await AsyncStorage.setItem('usuariotemp', temp);
          setTempU(JSON.parse(await AsyncStorage.getItem('usuariotemp')));
          setNombre(tempU.nombe_usuario);
          setApellido(tempU.apellido_usuario);
          setMail(tempU.email);
          console.log(tempU);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteAccount = async () => {
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado, se cerrara la sesion");
      navigation.navigate("Login");
    } else {
      var token = usuario.token;
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/usuario/eliminar', {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            id_usuario: usuarioA,
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
          console.log("Usuario Eliminado");
          navigation.goBack();

        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  const eliminarCuenta = () => {
    Alert.alert(
      "OpenBooks",
      "¿Seguro desea eliminar la cuenta? Todos los datos seran eliminados y no se podran recuperar.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: () => {
            deleteAccount();
          }
        }
      ]
    );
  };

  const valueChanged = async (value) => {
    setSelectedValue(await value);
    setUsuarioA(await value);
    console.log(selectedValue);
    console.log(usuarioA);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{ width: 50 }} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-circle-outline" size={40} />
        </TouchableOpacity>
        <Text style={styles.headerT}>Eliminar Usuarios</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.form}>
          <View style={styles.containerDrop}>
            <Text style>
              Seleccione un usuario
            </Text>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(value) => verAlmacenamiento(value)}>

              <Picker.Item label="Seleccionar"/>
              {usuarios == [] ? (<Picker.Item />) : (
                usuarios.map((item, key) => {
                  return (
                    <Picker.Item key={key} label={item.idusuarios} value={item.idusuarios} />
                  )
                })
              )
              }
            </Picker>
          </View>
          <TextInput value={nombre}
            editable={false}
            onChangeText={setNombre}
            style={styles.textinput}
            placeholder="Nombre"
            underlineColorAndroid={'transparent'} />
          <TextInput value={apellido}
            editable={false}
            onChangeText={setApellido}
            style={styles.textinput} placeholder="Apellido"
            underlineColorAndroid={'transparent'} />
          <TextInput value={mail}
            editable={false}
            onChangeText={setMail}
            style={styles.textinput} placeholder="Correo Electronico"
            underlineColorAndroid={'transparent'} />
          <TouchableOpacity style={styles.button} onPress={eliminarCuenta}>
            <Text style={styles.btntext}>Eliminar Cuenta</Text>
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
  }

});