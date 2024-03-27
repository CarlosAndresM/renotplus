import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';  
import * as SQLite from 'expo-sqlite'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrarUsuarios from './src/RegistrarUsuarios'; 
import ActividadesPagadas from './src/ActividadesPagadas';  
import RegistrarPagos from './src/RegistrarPagos';
import ListaUsuarios from './src/ListaUsuarios';
import Respaldo from './src/Respaldo';
import 'react-native-gesture-handler';

import { StyleSheet } from 'react-native';

const db = SQLite.openDatabase('Data.db');
const Stack = createStackNavigator();

export default function App() {
  const [tableCreated, setTableCreated] = useState(false); 

  useEffect(() => { 

    if (!tableCreated) {
      db.transaction(tx => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS Usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, numero INTEGER NOT NULL);",
          [],
          () => {
            console.log('Tabla Usuarios creada correctamente');
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS Actividades_Pagadas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_usuario INTEGER NOT NULL,
                id_actividad INTEGER NOT NULL, 
                fecha TEXT NOT NULL,
                cantidad REAL NOT NULL,
                FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
              );`,
              [],
              () => {
                console.log('Tabla Actividades_Pagadas creada correctamente');
                setTableCreated(true); 
              },
              (_, error) => {
                console.log('Error al crear la tabla Actividades_Pagadas', error);
              }
            );
          },
          (_, error) => {
            console.log('Error al crear la tabla Usuarios', error);
          }
        );
      });
    }
  }, [tableCreated]);

  // Cerrar todas las transacciones al salir de la aplicación
  useEffect(() => {
    return () => {
      db._db.close(); // Cierra la base de datos
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ActividadesPagadas"
          component={ActividadesPagadas}
          options={{ headerShown: false }}
          
        />
<Stack.Screen
  name="RegistrarUsuarios"
  component={RegistrarUsuarios}
  options={{ headerShown: false }}
/>
        <Stack.Screen
          name="ListaUsuarios"
          component={ListaUsuarios}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegistrarPagos"
          component={RegistrarPagos}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Respaldo"
          component={Respaldo}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainScreen({ navigation }) {
  return (
    <View style={styles.mainScreenContainer}> 
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>RenotPlus</Text>
        <View style={styles.logoDescriptionContainer}>  
          <Text style={styles.logoDescription}>Gestor de pagos</Text>
          <Image source={require('./assets/logo-iglesia.png')} style={styles.logoImage} />
        </View>
      </View>
      <View style={styles.linkContainer}>
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('RegistrarUsuarios')}
        >
          <Text style={styles.linkText}>Usuarios</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('ActividadesPagadas')}
        >
          <Text style={styles.linkText}>Actividades</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('Respaldo')}
        >
          <Text style={styles.linkText}>Respaldo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#423e67',
    padding: 20,
  },
  logoContainer: {
    width: '80%',
    height: 140,
    borderRadius: 20,
    backgroundColor: '#e2b989',
    padding: 20, 
    marginBottom: 20,
  },
  logoDescriptionContainer: {
    flexDirection: 'row', 
    alignItems: 'center',  
    justifyContent:'space-between',
  },
  logoImage: {
    width: 50, 
    height: 50,  
    marginRight: 10,  
    right: 0,
  },
  logoText: {
    color: '#433e68',
    fontSize: 28, 
    marginBottom: 5,
  },
  logoDescription: {
    marginTop: 20,
    color: '#433e68',
    fontSize: 15,
  },
  linkContainer: {
    width: '80%',
    height: 350,
    borderRadius: 20,
    marginTop: 70,
    backgroundColor: '#322b53',
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    width: '70%',
    height: 40,
    backgroundColor: '#e2b989',
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    color: '#322b53',
    fontSize: 16,
  },
});
