// ListaUsuarios.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'; 
import * as SQLite from 'expo-sqlite'; 

const db = SQLite.openDatabase('database.db');
export default function ListaUsuarios({ navigation, route }) {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Usuarios WHERE nombre LIKE ?',
        [`%${filtro}%`],
        (_, { rows: { _array } }) => {
          console.log('Usuarios filtrados:', _array);
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
    <View>
      <TextInput
        placeholder="Filtrar usuarios..."
        value={filtro}
        onChangeText={setFiltro}
      />
      <FlatList
        data={usuarios}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUsuarioSeleccionado(item.id)}>
            <Text>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}
