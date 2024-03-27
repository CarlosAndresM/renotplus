import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('Data.db');

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
            db.transaction(tx => {
              tx.executeSql(
                'DELETE FROM Usuarios WHERE id = ?',
                [id],
                () => {
                  console.log('Usuario eliminado correctamente');
                  obtenerUsuarios();
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
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={usuarios}
          keyExtractor={usuario => usuario.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.userInfoContainer}>
                <View>
                  <Text style={styles.text}>Nombre: {item.nombre}</Text>
                  <Text style={styles.text}>Número: {item.numero}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => editarUsuario(item.nombre, item.numero, item.id)}>
                    <Text style={styles.editButton}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => borrarUsuario(item.id, item.nombre)}>
                    <Text style={styles.deleteButton}>Borrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditandoUsuario(null);
          setModalVisible(true);
        }}
      >
        <FontAwesome name="plus" size={24} color="#322b53" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setNombreUsuario('');
          setNumeroUsuario('');
          setEditandoUsuario(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Nombre"
              style={styles.input}
              value={nombreUsuario}
              onChangeText={setNombreUsuario}
            />
            <TextInput
              placeholder="Número"
              style={styles.input}
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



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#423e67'
  },
  itemContainer: { 
    overflowY: 'scroll',
    borderRadius: 10,
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 3,
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',  
    width: '100%', 
    backgroundColor: '#e2b989',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {  
    flexDirection: 'row', 
  },
  editButton: {
    color: '#322b53',
    marginRight: 10
  },
  deleteButton: {
    color: '#322b53',
  },  
  text: {
    color: '#322b53',
    paddingLeft: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%'
  },
  input: {
    marginBottom: 10,
    borderBottomWidth: 1,
  }
});
