import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native'; 
import * as SQLite from 'expo-sqlite'; 
const db = SQLite.openDatabase('Data.db');


export default function ListaUsuarios({ navigation, route }) {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Usuarios WHERE nombre LIKE ?',
        [`%${filtro}%`],
        (_, { rows: { _array } }) => { 
          setUsuarios(_array);
        },
        (_, error) => console.log('Error al ejecutar la consulta SQL:', error)
      );
    });
  }, [filtro]);
  

  const handleUsuarioSeleccionado = (idUsuario) => {
    navigation.navigate('RegistrarPagos', {
      idUsuario: idUsuario ,
      activityId: route.params.activityId
    });
  };

  return (
    <View style={styles.mainScreenContainer}>
      <TextInput
        style={styles.input}
        placeholder="Filtrar usuarios..."
        value={filtro}
        onChangeText={setFiltro}
      />
      <FlatList
        data={usuarios}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userItem} onPress={() => handleUsuarioSeleccionado(item.id)}>
            <Text style={styles.userItemText}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainScreenContainer: {
    flex: 1,
    paddingTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#423e67',
    padding: 20,
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  userItem: {
    overflowY: 'scroll',
    width: 300,
    height: 40,
    backgroundColor: '#e2b989',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  userItemText: {
    color: '#433e68',
    fontSize: 16,
  },
});
