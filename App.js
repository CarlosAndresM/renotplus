import React, { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native';
import * as SQLite from 'expo-sqlite'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrarUsuarios from './src/RegistrarUsuarios'; 
import ActividadesPagadas from './src/ActividadesPagadas';  
import RegistrarPagos from './src/RegistrarPagos';
import ListaUsuarios from './src/ListaUsuarios';
import Respaldo from './src/Respaldo';
import 'react-native-gesture-handler';



const db = SQLite.openDatabase('database.db');
const Stack = createStackNavigator();



export default function App() {  
  const [tableCreated, setTableCreated] = useState(false); 
  useEffect(() => {


    if (!tableCreated) {
      // db.transaction(tx => {
      //   tx.executeSql(
      //     "DROP TABLE IF EXISTS Usuarios;",
      //     [],
      //     () => {
      //       console.log('Tabla Usuarios eliminada correctamente');
      //     },
      //     (_, error) => {
      //       console.log('Error al eliminar la tabla Usuarios:', error);
      //     }
      //   );
      //   tx.executeSql(
      //     "DROP TABLE IF EXISTS Actividades_Pagadas;",
      //     [],
      //     () => {
      //       console.log('Tabla Actividades_Pagadas eliminada correctamente');
      //     },
      //     (_, error) => {
      //       console.log('Error al eliminar la tabla Actividades_Pagadas:', error);
      //     }
      //   );
      // });
      
   
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
  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ title: 'Menu principal' }}
        />
        <Stack.Screen
          name="ActividadesPagadas"
          component={ActividadesPagadas}
          options={{title: 'Actividades'}}
        />
        <Stack.Screen
          name="RegistrarUsuarios"
          component={RegistrarUsuarios}
          options={{ title: 'Registro de usuarios' }}
        />
        <Stack.Screen
          name="ListaUsuarios"
          component={ListaUsuarios}
          options={{ title: 'Lista de usuarios' }}
        />
        <Stack.Screen
        name="RegistrarPagos"
        component={RegistrarPagos}
        options={{title: 'Registrar pagos'}}
        />
        <Stack.Screen 
        name="Respaldo"
        component={Respaldo}
        options={{title: 'Respaldo'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'start' }}>
      <Text>¡Conexión a la base de datos SQLite exitosa!</Text>  
      <Button
        title='Registrar usuarios'
        onPress={() => navigation.navigate('RegistrarUsuarios')}
      />

      <Button
        title='Actividades'
        onPress={() => navigation.navigate('ActividadesPagadas')}
      />

      <Button
        title='Respaldo'
        onPress={() => navigation.navigate('Respaldo')}
      />
    </View>
  );
}