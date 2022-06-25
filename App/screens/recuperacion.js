import * as React from 'react';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';

export default ({ navigation }) => {

    const [usuario, setUsuario] = useState(null);
    const [focusNombre, setFocusNombre] = useState(false);
    const recuperacion = async () => {
        setUsuario(null);
        if (!usuario) {
            console.log("Debe Escribir los datos completos");
            Alert.alert("OpenBooks", "Debe Escribir los datos completos");
        }
        else {
            try {
                const response = await fetch('http://192.168.1.72:3001/OpenBooks/recuperarPass', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        usuario: usuario
                    })
                });
                const json = await response.json();
                //console.log(json);
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
                >
                </TextInput>
                <TouchableOpacity style={styles.Appbutton} onPress={recuperacion}>
                    <Text style={styles.AppbuttonText}>Recuperar Contraseña</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Appbuttonreg} onPress={() => navigation.goBack()}>
                    <Text style={styles.AppbuttonText}>Cancelar</Text>
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
      Appbuttonreg: {
        backgroundColor: '#5F4B3B',
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