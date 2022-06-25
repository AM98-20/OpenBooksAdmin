import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App({ navigation }) {

  const CerrarSesion = () => {
    Alert.alert(
      "OpenBooks",
      "¿Seguro desea cerrar la sesión?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK", onPress: async () => {
            await AsyncStorage.removeItem('usuario');
            console.log("Sesion Cerrada");
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container} >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Image source={require('../../assets/icon.png')} style={styles.img}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={CerrarSesion}>
          <Ionicons color={"white"} name="exit" size={32} ></Ionicons>
        </TouchableOpacity>
      </View>

      <View style={styles.menuDeOpciones}>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Book')}>
          <View style={styles.opcion} >
            <Ionicons style={styles.iconOpcion} size={20} name="book" ></Ionicons>
            <Text>Libros</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Author')}>
          <View style={styles.opcion}>
            <Ionicons style={styles.iconOpcion} size={20} name="pencil" ></Ionicons>
            <Text>Autores</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Genre')}>
          <View style={styles.opcion}>
            <Ionicons style={styles.iconOpcion} size={20} name="shapes" ></Ionicons>
            <Text>Géneros Literarios</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
          <View style={styles.opcion}>
            <Ionicons style={styles.iconOpcion} size={20} name="person-add" ></Ionicons>
            <Text>Registro</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#cac3b2",
    height: '100%',
    alignItems: 'center',
    flex: 1
  },
  header: {
    display: 'flex',
    flex: 0.5,
    backgroundColor: "#1c5679",
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 8,
    paddingTop: 8,
    justifyContent: 'space-between'
  },
  tittle: {
    fontSize: 20,
    color: "white",
  },
  menuDeOpciones: {
    flex: 4,
    justifyContent: 'space-between',
    margin: 32
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 32,
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 16
  },
  iconOpcion: {
    marginRight: 16
  },
  img: {
    width: 70,
    height: 70,
  },
  button: {
    backgroundColor: '#808C5C',
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
