import React from 'react';
import { SafeAreaView, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings({ navigation }) {

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
            id_usuario: await usuario.usuario.idusuarios,
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
          await AsyncStorage.removeItem('usuario');
          console.log("Usuario Eliminado");
          navigation.navigate('Login');
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

  return (

    <SafeAreaView style={{ margin: 50, flex: 1 }}>
      <Button title="Toggle Drawer" onPress={() => navigation.toggleDrawer()} />
      <Button
        title="Cambiar Contraseña"
        onPress={() => navigation.navigate('Update')}
      />
      <Button
        title="Cerrar Sesion"
        onPress={() => navigation.navigate("Login")}
      />
      <Button
        color='#FF0000'
        title="Eliminar Cuentas"
        onPress={() => navigation.navigate('Delete')}
      />
      <Button
        color='#FF0000'
        title="Eliminar Cuenta Propia"
        onPress={eliminarCuenta}
      />
    </SafeAreaView>
  )
};

