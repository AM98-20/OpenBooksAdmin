import React from 'react';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';


import Login from '../screens/login';
import Recuperacion from '../screens/recuperacion';
import MenuRegistro from '../screens/menuUsuarios/menuRegistro';
import MenuLibro from '../screens/menuLibros/menuLibros';
import MenuGenero from '../screens/menuGeneros/menuGeneros';
import MenuAutor from '../screens/menuAutores/menuAutor';
import Settings from '../screens/Settings';
import Update from '../screens/updatePassword';

import deleteUser from '../screens/deleteUsers';

//otros
//import Libro from '../screens/agregarLibro';
import Main from '../screens/mainMenu';
import updateA from '../screens/menuAutores/update';
import updateG from '../screens/menuGeneros/update';
import updateL from '../screens/menuLibros/update';
import updateU from '../screens/menuUsuarios/updateInfo';
import registroA from '../screens/menuAutores/registro';
import registroG from '../screens/menuGeneros/registro';
import registroL from '../screens/menuLibros/registro';
import registroU from '../screens/menuUsuarios/registro';

const MenuStack = createNativeStackNavigator();
const MenuStackScreen = () => (
  <MenuStack.Navigator screenOptions={{ headerShown: false }}>
    <MenuStack.Screen name="Main" component={Main}/>
    <MenuStack.Screen name="Register" component={MenuRegistro}/>
    <MenuStack.Screen name="Book" component={MenuLibro}/>
    <MenuStack.Screen name="Genre" component={MenuGenero}/>
    <MenuStack.Screen name="Author" component={MenuAutor}/>
    <MenuStack.Screen name="Settings" component={Settings} />
    <MenuStack.Screen name="Update" component={Update} />
    <MenuStack.Screen name="Login" component={Login} />
    <MenuStack.Screen name="updBook" component={updateL} />
    <MenuStack.Screen name="updUser" component={updateU} />
    <MenuStack.Screen name="updAuthor" component={updateA} />
    <MenuStack.Screen name="updGenre" component={updateG} />
    <MenuStack.Screen name="newBook" component={registroL} />
    <MenuStack.Screen name="newUser" component={registroU} />
    <MenuStack.Screen name="newAuthor" component={registroA} />
    <MenuStack.Screen name="newGenre" component={registroG} />
    <MenuStack.Screen name="Delete" component={deleteUser} />
  </MenuStack.Navigator>
);

const AppDrawer = createDrawerNavigator();
const AppDrawerScreen = () => (
  <AppDrawer.Navigator screenOptions={{ headerShown: false }}
    drawerPosition="right" initialRouteName="Home" drawerContent={props => {
      return (
        <DrawerContentScrollView {...props} style={{marginBottom: 10}}>
          <DrawerItemList {...props} />
          <DrawerItem label="Logout" onPress={() => props.navigation.navigate("Login")} />
        </DrawerContentScrollView>
      )}}>
    <AppDrawer.Screen
      name="Drawer"
      component={MenuStackScreen}
      options={{
        drawerLabel: 'Home',
      }}
    />
    <AppDrawer.Screen
      name="Registro"
      component={MenuRegistro}
    />
    <AppDrawer.Screen
      name="Libro"
      component={MenuLibro}
    />
    <AppDrawer.Screen
      name="Generos"
      component={MenuGenero}
      options={{
        drawerLabel: 'Generos Literarios',
      }}
    />
    <AppDrawer.Screen
      name="Autor"
      component={MenuAutor}
    />
    <AppDrawer.Screen
      name="Settings"
      component={Settings}
    />
  </AppDrawer.Navigator>
);

const AuthStack = createNativeStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="Reset" component={Recuperacion}/>
    <AuthStack.Screen name="Main" component={AppDrawerScreen} />
    <AuthStack.Screen name="updBook" component={updateL} />
    <AuthStack.Screen name="updUser" component={updateU} />
    <AuthStack.Screen name="updAuthor" component={updateA} />
    <AuthStack.Screen name="updGenre" component={updateG} />
    <AuthStack.Screen name="newBook" component={registroL} />
    <AuthStack.Screen name="newUser" component={registroU} />
    <AuthStack.Screen name="newAuthor" component={registroA} />
    <AuthStack.Screen name="newGenre" component={registroG} />
    <AuthStack.Screen name="Delete" component={deleteUser} />
  </AuthStack.Navigator>
);



export default () => {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const buscarUsuario = async () => {
    await AsyncStorage.removeItem('usuario');

    const usuario = JSON.parse(await AsyncStorage.getItem('usuario'));

    if (!usuario) {
      console.log("Usuario no autenticado");
      setUsuario(null);
      setIsLoading(false);
    }
    else {
      console.log(usuario.usuario.nombe_usuario + " " + usuario.usuario.apellido_usuario);
      setUsuario(usuario.usuario.nombe_usuario + " " + usuario.usuario.apellido_usuari);
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    setTimeout(() => {
      buscarUsuario();
    }, 300);
  }, []);

  return (
    
    <NavigationContainer>
      {isLoading ? (<Loading />) : usuario ?
        (<AppDrawerScreen name="Main" />) : (<AuthStackScreen name="Auth" />)}
    </NavigationContainer>
  );
};