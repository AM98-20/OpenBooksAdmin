import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import ApiKeys from '../../config/ApiKeys';

import uuid from "uuid";

export default function editarLibro({ navigation }) {

  //const firebasePath = "gs://openbooks-bd974.appspot.com/Image ";

  const app = initializeApp(ApiKeys.firebaseConfig);

  const [autores = [], setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [libroUpt = [], setLibroUpt] = useState([]);
  const [imageFile, setImageFile] = useState("");
  const [documentFile, setDocumentFile] = useState("");

  const [selectedValue, setSelectedValue] = useState(0);
  const [selectedValue1, setSelectedValue1] = useState(0);
  const [selectedValue2, setSelectedValue2] = useState(0);
  const [storageLibros, setStorageLibros] = useState([]);
  const [idlibros, setIdLibro] = useState(undefined);
  const [nombre_libro, setNombreLibro] = useState("");
  const [preName, setpreName] = useState("");
  const [num_paginas, setNumPaginas] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [libro, setLibroUrl] = useState("");
  const [img_libro, setImg_libro] = useState("");
  const [idautores, setIdautores] = useState(undefined);
  const [nombreAutor, setNombreAutor] = useState("");
  const [preNombreAutor, setPreNombreAutor] = useState("");
  const [idgl, setIdgl] = useState(undefined);
  const [editorial, setEditorial] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      setAutores([]);
      setGeneros([]);
      setLibroUpt([]);
      setImageFile("");
      setDocumentFile("");
      setSelectedValue(0);
      setSelectedValue1(0);
      setSelectedValue2(0);
      setStorageLibros([]);
      setIdLibro(undefined);
      setIdgl(undefined);
      setNombreLibro("");
      setNumPaginas("");
      setDescripcion("");
      setImg_libro("");
      setIdautores(undefined);
      setEditorial("");
      cargarDatos();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []));

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

    var deleteRef = ref(getStorage(), type + "/" + preName);// creo aca se elimina
    //var file = imageFile.replace('https://firebasestorage.googleapis.com/v0/b/openbooks-bd974.appspot.com/o/', '');
    console.log(deleteRef);
    deleteObject(deleteRef).then(() => {
      // File deleted successfully
      console.log("Archivo eliminado.");
    }).catch((error) => {
      // Uh-oh, an error occurred!
      console.log("No se pudo eliminar el archivo.");
      console.error(error);
    });

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

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  }

  cargarDatos = async () => {
    setStorageLibros(JSON.parse(await AsyncStorage.getItem('libros')));
    setAutores(JSON.parse(await AsyncStorage.getItem('autores')));
    setGeneros(JSON.parse(await AsyncStorage.getItem('generos')));
  }

  const verAlmacenamiento = async (value) => {
    valueChanged1(await value);
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado, se cerrara la sesion");
      navigation.navigate("Login");
    }
    else {
      var token = usuario.token;
      //console.log('Bearer ' + token)
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/libro/preview', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            id: value,
          })
        });
        const json = await response.json();
        //console.log(json);
        if (json.data.length == 0) {
          Alert.alert("OpenBooks", json.msj);
        }
        else {
          const temp = JSON.stringify(json.data)
          await AsyncStorage.setItem('libroUpt', temp);
          setLibroUpt(JSON.parse(await AsyncStorage.getItem('libroUpt')));
          const str = await ('' + libroUpt.num_paginas);
          setSelectedValue(await libroUpt.idlibros);
          setNumPaginas(await str);
          setNombreLibro(await libroUpt.nombre_libro);
          setpreName(await libroUpt.nombre_libro);
          setDescripcion(await libroUpt.descripcion);
          setLibroUrl(await libroUpt.libro);
          setImg_libro(await libroUpt.img_libro);
          valueChanged(await libroUpt.idautores);
          setNombreAutor(await libroUpt.autore.nombre_autor);
          setPreNombreAutor(await libroUpt.autore.nombre_autor);
          valueChanged2(await libroUpt.idgl);
          setEditorial(await libroUpt.editorial);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const editar = async () => {
    var urlImg = "";
    var urlPdf = "";
    console.log(idgl);
    console.log(idautores);
    if (imageFile != "") {
      urlImg = await uploadFile(imageFile, 'Image');
    } else {
      urlImg = img_libro;
    }
    if (documentFile != "") {
      urlPdf = await uploadFile(documentFile, 'PDF');
    } else {
      urlPdf = libro;
    }
    var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
    if (selectedValue != 0 || selectedValue1 != 0 || !num_paginas || !descripcion) {
      console.log("Debe Escribir los datos completos");
      Alert.alert("OpenBooks", "Debes Escribir los datos completos 1");
    }
    if (!urlPdf || !urlImg) {
      console.log("Debe Escribir los datos completos");
      Alert.alert("OpenBooks", "Debes Escribir los datos completos 2");
    }
    if (!idautores || !editorial || !idgl) {
      console.log("Debe Escribir los datos completos");
      Alert.alert("OpenBooks", "Debes Escribir los datos completos 3");
    } else {

      var token = usuario.token;
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/libro/actualizar', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            id: idlibros,
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
  };

  const eliminar = async () => {

    var usuario = (JSON.parse(await AsyncStorage.getItem('usuario')));
    if (!usuario) {
      console.log("Usuario no autenticado");
      Alert.alert("OpenBooks", "Usuario no autenticado");
      //salir del app
    }
    else {

      var token = usuario.token;
      try {
        const response = await fetch('http://192.168.1.72:3001/OpenBooks/libro/eliminar', {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            id: idlibros,
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

  const valueChanged = async (value) => {
    setSelectedValue1(await value);
    setIdautores(await value);
    console.log(idautores);
    console.log(selectedValue1);
  }
  const valueChanged1 = async (value, label) => {
    setSelectedValue(await value);
    setIdLibro(await value);
    setNombreAutor(await label);
    console.log(idlibros);
  }
  const valueChanged2 = async (value) => {
    setSelectedValue2(await value);
    setIdgl(await value);
    console.log(idgl);
  }

  return (

    <View style={styles.container}>
      <View style={styles.body}>

        <ScrollView style={styles.form}>

          <View style={styles.containerDrop}>
            <Text style>
              Seleccione el libro que desea actualizar:
            </Text>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(value) => verAlmacenamiento(value)}>
              <Picker.Item label="Seleccionar" />
              {storageLibros == null ? (<Picker.Item />) : (
                storageLibros.map((item, key) => {
                  return (
                    <Picker.Item key={key} label={item.nombre_libro} value={item.idlibros} />
                  )
                })
              )
              }
            </Picker>
          </View>

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
            multiline
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
            <Text style>
              Seleccione un autor
            </Text>
            <Picker
              selectedValue={selectedValue1}
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

          <TouchableOpacity style={styles.button} onPress={editar}>
            <Text style={styles.btntext}>Actualizar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={eliminar}>
            <Text style={styles.btntext}>Eliminar Registro</Text>
          </TouchableOpacity>

        </ScrollView>
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