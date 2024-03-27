import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('database.db');

export default function RegistrarPagos({ route }) {
  const [activity, setActivity] = useState('');
  const [userName, setUserName] = useState('');
  const [payments, setPayments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [fecha, setfecha] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [editandoPago, setEditandoPago] = useState(null);   


  useEffect(() => { 
    fetchActivityName(); 
    fetchUserName(); 
    fetchPayments();
  }, []);

  const fetchActivityName = () => { 
    const { activityId } = route.params;
    let activityName = '';
    switch (activityId) {
      case 1:
        activityName = 'Aseo';
        break;
      case 2:
        activityName = 'Campamento';
        break;
      case 3:
        activityName = 'Libro';
        break;
      case 4:
        activityName = 'Otros';
        break;
      default:
        activityName = '';
    }
    setActivity(activityName);
  };

  const fetchUserName = () => { 
    const { idUsuario } = route.params;
    db.transaction(tx => {
      tx.executeSql(
        'SELECT nombre FROM Usuarios WHERE id = ?;',
        [idUsuario],
        (_, { rows }) => {
          if (rows.length > 0) {
            setUserName(rows.item(0).nombre);
          }
        },
        (_, error) => {
          console.log('Error fetching user name:', error);
        }
      );
    });
  };

  const fetchPayments = () => { 
    const { idUsuario, activityId } = route.params;
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Actividades_Pagadas WHERE id_usuario = ? AND id_actividad = ?;',
        [idUsuario, activityId],
        (_, { rows }) => {
          const paymentsArray = rows._array;
          setPayments(paymentsArray);
        },
        (_, error) => {
          console.log('Error fetching payments:', error);
        }
      );
    });
  };
  

  const handleRegistrarPago = () => { 
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Actividades_Pagadas (id_usuario, id_actividad, fecha, cantidad) VALUES (?, ?, ?, ?);',
        [route.params.idUsuario, route.params.activityId, fecha, cantidad],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log('Pago registrado correctamente');
            setModalVisible(false);
            fetchPayments(); // Actualizar la lista de pagos
          } else {
            console.log('Error al registrar el pago');
          }
        },
        (_, error) => {
          console.log('Error al ejecutar la consulta de inserción:', error);
        }
      );
    });
  };


  // Función para formatear la cantidad con el signo de dinero
function formatCurrency(amount) {
    return "$" + amount.toLocaleString();
  }
  
  // Función para formatear la fecha en el formato dd/mm/yyyy
  function formatDate(fechaNum) {
    let fechaStr = fechaNum.toString();
    let dia = fechaStr.substring(0, 2);
    let mes = fechaStr.substring(2, 4);
    let año = fechaStr.substring(4);
    let fechaFormateada = dia + '/' + mes + '/' + año;
    return fechaFormateada;
}

const borrarPago = (id, idUser, idActividad, pago) => {
    Alert.alert(
      'Confirmar',
      `¿Estás seguro de borrar el pago ` + formatCurrency(pago),
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
                'DELETE FROM Actividades_Pagadas WHERE id = ? AND id_usuario = ? AND id_actividad = ?',
                [id, idUser, idActividad],
                () => {
                  console.log('Pago eliminado correctamente');
                  fetchPayments(); // Actualizar la lista de pagos después de borrar
                },
                (_, error) => {
                  console.log('Error al eliminar pago:', error);
                }
              );
            });
          }
        }
      ]
    );
  };
   

  const editarPago = (id, fecha, cantidad) => {  
    setfecha(fecha); 
    setCantidad(String(cantidad));
    setEditandoPago(id);
    setModalVisible(true); 
};

const actualizarPago = () => { 
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Actividades_Pagadas SET fecha = ?, cantidad = ? WHERE id = ? AND id_usuario = ? AND id_actividad = ? ',
        [fecha, cantidad, editandoPago, route.params.idUsuario, route.params.activityId],
        (_, { rowsAffected }) => {  
          if (rowsAffected > 0) {
            console.log('Pago actualizado correctamente');
            setModalVisible(false);
            fetchPayments(); // Actualizar la lista de pagos
            setEditandoPago(null); // Restablecer el estado de edición
          } else {
            console.log('No se pudo actualizar el pago');
          }
        },
        (_, error) => {
          console.log('Error al actualizar el pago:', error);
        }
      );
    });
  };
  

    

  return (
    <View style={styles.container}>
      <Text>{`Actividad: ${activity}`}</Text>
      <Text>{`Usuario: ${userName}`}</Text>
      <Text>Pagos:</Text>
      {payments.map(payment => (
      <View key={payment.id}>
        <Text>{`Fecha: ${formatDate(payment.fecha)}, Cantidad: ${formatCurrency(payment.cantidad)}`}</Text>
        <TouchableOpacity onPress={() => editarPago(payment.id, payment.fecha, payment.cantidad)}>
          <Text style={{ color: 'blue', marginRight: 10 }}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => borrarPago(payment.id, payment.id_usuario, payment.id_actividad, payment.cantidad )}>
          <Text style={{ color: 'red' }}>Borrar</Text>
        </TouchableOpacity>
      </View>
    ))}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <TextInput
            placeholder="fecha (dd/mm/aaaa)"
            value={fecha}
            onChangeText={text => setfecha(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Cantidad"
            value={cantidad}
            onChangeText={text => setCantidad(text)}
            keyboardType="numeric"
            style={styles.input}
          />
       <Button 
  title={editandoPago ? "Editar pago" : "Registrar Pago"} 
  onPress={() => editandoPago ? actualizarPago() : handleRegistrarPago()} 
/>

        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Shadow for Android
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    width: '80%',
  },
});
