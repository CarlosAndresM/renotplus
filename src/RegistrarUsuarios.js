import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite'; 
import { FontAwesome } from '@expo/vector-icons';
import 'react-native-gesture-handler';


const db = SQLite.openDatabase('database.db');
export default function RegistrarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [numeroUsuario, setNumeroUsuario] = useState('');
  const [editandoUsuario, setEditandoUsuario] = useState(null);  

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Usuarios;',
        [],
        (_, { rows }) => {
          const usuariosBD = rows._array;
          setUsuarios(usuariosBD);
        },
        (_, error) => {
          console.log('Error al obtener usuarios:', error);
        }
      );
    });
  };

  const agregarUsuario = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Usuarios (nombre, numero) VALUES (?, ?);',
        [nombreUsuario, numeroUsuario],
        () => {
          console.log('Usuario agregado correctamente');
          setModalVisible(false);
          obtenerUsuarios(); 
          setNombreUsuario('');
          setNumeroUsuario('');
        },
        (_, error) => {
          console.log('Error al agregar usuario:', error);
        }
      );
    });
  };

  const editarUsuario = (nombre, numero, id) => {  
    setNombreUsuario(nombre); 
    setNumeroUsuario(String(numero));
    setEditandoUsuario(id);
    setModalVisible(true);
  };

  const guardarEdicionUsuario = () => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Usuarios SET nombre = ?, numero = ? WHERE id = ?',
        [nombreUsuario, numeroUsuario, editandoUsuario],
        () => {
          console.log('Usuario actualizado');
          setModalVisible(false);
          obtenerUsuarios();
          // Restablecer los valores de los estados después de editar un usuario
          setNombreUsuario('');
          setNumeroUsuario('');
          setEditandoUsuario(null);
        },
        (_, error) => {
          console.log('Error al actualizar usuario:', error);
        }
      );
    });
  };


  const borrarUsuario = (id, nombreUsuario) => {
    Alert.alert(
      'Confirmar',
      `¿Estás seguro de borrar el usuario ${nombreUsuario}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Borrar',
          onPress: () => {
            // Implementa la lógica para borrar un usuario aquí
            console.log('borrando', id)
            db.transaction(tx => {
              tx.executeSql(
                'DELETE FROM Usuarios WHERE id = ?',
                [id],
                () => {
                  console.log('Usuario eliminado correctamente',);
                  obtenerUsuarios(); // Actualiza la lista de usuarios después de eliminar uno
                },
                (_, error) => {
                  console.log('Error al eliminar usuario:', error);
                }
              );
            });
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={usuarios}
        keyExtractor={usuario => usuario.id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <View>
              <Text>Nombre: {item.nombre}</Text>
              <Text>Número: {item.numero}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => editarUsuario(item.nombre, item.numero, item.id)}>
                <Text style={{ color: 'blue', marginRight: 10 }}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => borrarUsuario(item.id, item.nombre)}>
                <Text style={{ color: 'red' }}>Borrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: 'blue', borderRadius: 30, padding: 10 }}
        onPress={() => {
          setEditandoUsuario(null); // Reiniciar el estado de editandoUsuario al agregar un nuevo usuario
          setModalVisible(true);
        }}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          // Restablecer los valores de los estados si se cierra el modal
          setNombreUsuario('');
          setNumeroUsuario('');
          setEditandoUsuario(null);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <TextInput
              placeholder="Nombre"
              style={{ marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
              value={nombreUsuario}
              onChangeText={setNombreUsuario}
            />
            <TextInput
              placeholder="Número"
              style={{ marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
              value={numeroUsuario}
              onChangeText={setNumeroUsuario}
            />
            <Button title={editandoUsuario ? "Guardar Edición" : "Agregar Usuario"} onPress={editandoUsuario ? guardarEdicionUsuario : agregarUsuario} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

