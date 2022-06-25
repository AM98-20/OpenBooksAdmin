import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, BackHandler } from 'react-native';

export default function registro({ navigation }) {

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            cargarUsuario();
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, []));

    const [usuario, setUsuario] = useState(null);
    const [password, setpassword] = useState(null);
    const [newpassword, setNewpassword] = useState(null);

    const cargarUsuario = async () => {
        var usuario = JSON.parse(await AsyncStorage.getItem('usuario'));
        setUsuario(usuario.usuario.idusuarios);
    }

    const guardar = async () => {
        var usuarioA = JSON.parse(await AsyncStorage.getItem('usuario'));
        if ((!usuario || !password || !newpassword) && !usuarioA) {
            console.log("Debe Escribir los datos completos");
            Alert.alert("OpenBooks", "Debes Escribir los datos completos");

        } else {
            var token = usuarioA.token;
            try {
                const response = await fetch('http://192.168.1.72:3001/OpenBooks/usuario/cambiarPassword', {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token,
                    },
                    body: JSON.stringify({
                        usuario: usuario,
                        password: password,
                        newPassword: newpassword
                    })
                });
                const json = await response.json();
                console.log(json);
                if (json) {
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={{ width: 50 }} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-circle-outline" size={40} />
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <View style={styles.form}>
                    <TextInput value={password}
                        onChangeText={setpassword}
                        style={styles.textinput} placeholder="Ingrese su contraseña actual"
                        secureTextEntry={true} underlineColorAndroid={'transparent'} />
                    <TextInput value={newpassword}
                        onChangeText={setNewpassword}
                        style={styles.textinput} placeholder="Ingrese una Contraseña"
                        secureTextEntry={true} underlineColorAndroid={'transparent'} />

                    <TouchableOpacity style={styles.button} onPress={guardar}>
                        <Text style={styles.btntext}>Actualizar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#5F4B3B',
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
        borderBottomColor: '#CAC3B2',
        borderBottomWidth: 1,
    },
    button:
    {
        alignSelf: 'stretch',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#808C5C',
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