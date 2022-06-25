import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import ApiKeys from '../../config/ApiKeys';

import uuid from "uuid";

export default function registroLibro({ navigation }) {

  //if (!getApps =)
  const app = initializeApp(ApiKeys.firebaseConfig);

  const [autores = [], setAutores] = useState(undefined);
  const [generos, setGeneros] = useState(undefined);
  const [imageFile, setImageFile] = useState("");
  const [documentFile, setDocumentFile] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      setImageFile("");
      setDocumentFile("");
      setSelectedValue(0);
      setNombreLibro("");
      setNumPaginas("");
      setDescripcion("");
      setIdautores(0);
      setIdgl(0);
      setEditorial("");

      cargarDatos();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []));

  const [selectedValue, setSelectedValue] = useState(0);
  const [selectedValue2, setSelectedValue2] = useState(0);
  const [nombre_libro, setNombreLibro] = useState("");
  const [nombreAutor, setNombreAutor] = useState("");
  const [num_paginas, setNumPaginas] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idautores, setIdautores] = useState(0);
  const [idgl, setIdgl] = useState(0);
  const [editorial, setEditorial] = useState("");

  let openImagePickerAsync = async () => {
    try {
      let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }
      Alert.alert("OpenBooks", "Espere mientras carga el recurso.");
      let pickerResult = await ImagePicker.launchImageLibraryAsync();
      setImageFile(pickerResult.uri);
      console.log("ESTAAAA AQUI SE SUPONE");
      console.log(imageFile);
      if (imageFile != undefined) {
        Alert.alert("OpenBooks", "Recurso cargado.");
      } else {
        Alert.alert("OpenBooks", "El recurso no pudo cargar. Intente de nuevo.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  let openDocumentPickerAsync = async () => {
    try {
      Alert.alert("OpenBooks", "Espere mientras carga el recurso.");
      let pickerResult = await DocumentPicker.getDocumentAsync({});
      setDocumentFile(pickerResult.uri);
      console.log("ESTAAAA AQUI SE SUPONE");
      console.log(pickerResult.uri);
      if (documentFile != "") {
        Alert.alert("OpenBooks", "Recurso cargado.");
        console.log(documentFile);
      } else {
        Alert.alert("OpenBooks", "El recurso no pudo cargar. Intente de nuevo.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const uploadFile = async (uri, type) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(getStorage(), "/" + type + "/" + nombre_libro + "-" + nombreAutor);
    const result = await uploadBytes(fileRef, blob);
    gs://openbooks-bd974.appspot.com/Image

    // We're done with the blob, close and release it
    blob.close();
    //console.log(await getDownloadURL(fileRef));
    return await getDownloadURL(fileRef);
  }

  const guardar = async () => {
    var urlImg = "";
    var urlPdf = "";
    if (imageFile != "") {
      urlImg = await uploadFile(imageFile,"Image");
    }
    if (documentFile != "") {
      urlPdf = await uploadFile(documentFile, "PDF");
    }
    if (!nombre_libro || !num_paginas || !descripcion) {
      console.log("Debe Escribir los datos completos");
      Alert.alert("OpenBooks", "Debes Escribir los datos completos");
    }
    if (!urlPdf || urlImg != "") {
      console.log("Debe Escribir los datos completos");
      Alert.alert("OpenBooks", "Debes Escribir los datos completos");
    }
    if (!idautores) {
      console.log("Debe Escribir los datos completos");
      Alert.alert("OpenBooks", "Debes Escribir los datos completos");
    } else {
      var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
      if (!usuario) {
        console.log("Usuario no autenticado");
        Alert.alert("OpenBooks", "Usuario no autenticado");
      }
      else {
        var token = usuario.token;
        try {
          const response = await fetch('http://192.168.1.72:3001/OpenBooks/libro/guardar', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
              nombre: nombre_libro,
              num_paginas: num_paginas,
              descripcion: descripcion,
              archivo: urlPdf,
              portada: urlImg,
              autorid: idautores,
              idgl: idgl,
              editorial: editorial
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
    }
  }
  cargarDatos = async () => {
    setAutores(JSON.parse(await AsyncStorage.getItem('autores')));
    setGeneros(JSON.parse(await AsyncStorage.getItem('generos')));
  }

  const valueChanged = (value) => {
    setSelectedValue(value);
    setIdautores(value);
    console.log(idautores);
  }
  const valueChanged2 = async (value, label) => {
    setSelectedValue2(await value);
    setIdgl(await value);
    setNombreAutor(await label)
    console.log(idgl);
  }

  return (

    <ScrollView style={styles.container}>
      <View style={styles.body}>

        <View style={styles.form}>
          <TextInput value={nombre_libro}
            onChangeText={setNombreLibro}
            style={styles.textinput}
            placeholder="Ingrese el nombre del libro"
            underlineColorAndroid={'transparent'} />

          <TextInput value={num_paginas}
            onChangeText={setNumPaginas}
            style={styles.textinput} placeholder="Ingrese numero de paginas"
            underlineColorAndroid={'transparent'}
            keyboardType="numeric" />

          <TextInput value={descripcion}
            numberOfLines={50}
            onChangeText={setDescripcion}
            style={styles.textinput} placeholder="Ingrese la descripcion del libro"
            underlineColorAndroid={'transparent'} />

          <TouchableOpacity onPress={openDocumentPickerAsync} style={styles.buttonFiles}>
            <Text>Seleccione una ducumento</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={openImagePickerAsync} style={styles.buttonFiles}>
            <Text>Seleccione una imagen</Text>
          </TouchableOpacity>


          <View style={styles.containerDrop}>
            <Text style={styles.paragraph}>
              Seleccione un autor
            </Text>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(value, label) => valueChanged(value, label)}>
              <Picker.Item label="Seleccionar" />
              {autores == undefined ? (<Picker.Item />) : (
                autores.map((item, key) => {
                  return (
                    <Picker.Item key={key} label={item.nombre_autor} value={item.idautores} />
                  )
                })
              )
              }
            </Picker>
          </View>

          <View style={styles.containerDrop}>
            <Text style={styles.paragraph}>
              Seleccione el genero literario principal del libro:
            </Text>
            <Picker
              selectedValue={selectedValue2}
              onValueChange={(value) => valueChanged2(value)}>
              <Picker.Item label="Seleccionar" />
              {generos == undefined ? (<Picker.Item />) : (
                generos.map((item, key) => {
                  return (
                    <Picker.Item key={key} label={item.generos_literarios} value={item.idgl} />
                  )
                })
              )
              }
            </Picker>
          </View>

          <TextInput value={editorial}
            onChangeText={setEditorial}
            style={styles.textinput} placeholder="Ingrese la editorial"
            underlineColorAndroid={'transparent'} />

          <TouchableOpacity style={styles.button} onPress={guardar}>
            <Text style={styles.btntext}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
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
  buttonFiles:
  {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2A9DF4',
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
  paragraph: {
    alignSelf: 'stretch',
    height: 50,
    color: '#000',
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
  },
});