import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('Data.db');


export default function RegistrarPagos({ route }) {
  const [activity, setActivity] = useState('');
  const [userName, setUserName] = useState('');
  const [payments, setPayments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [fecha, setFecha] = useState('');
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
          let paymentsArray = rows._array;
          // Ordenar las fechas de forma descendente (de más reciente a más antiguo)
          paymentsArray.sort((a, b) => b.fecha - a.fecha);
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
            fetchPayments(); 
            setFecha('');
            setCantidad('');
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

 
 

  function formatCurrency(amount) {
    return "$" + amount.toLocaleString();
  }

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
      `¿Estás seguro de borrar el pago ${formatCurrency(pago)}?`,
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
                  fetchPayments(); 
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
    setFecha(fecha);
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
            fetchPayments();  
            setFecha('');
            setCantidad('');
            setEditandoPago(null); 
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
      <View style={styles.container_title}>
        <Text style={styles.heading}>{`Actividad: ${activity}`}</Text>
        <Text style={styles.heading2}>{`${userName}`}</Text>  
      </View>
      {payments.map(payment => (
        
          <View key={payment.id} style={styles.paymentContainer}>
          <Text style={styles.paymentText}>{`Fecha: ${formatDate(payment.fecha)}`}</Text>
          <Text style={styles.paymentText}>{`Cantidad: ${formatCurrency(payment.cantidad)}`}</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={() => editarPago(payment.id, payment.fecha, payment.cantidad)}>
              <Text style={[styles.actionText, styles.edit]}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => borrarPago(payment.id, payment.id_usuario, payment.id_actividad, payment.cantidad)}>
            <Text style={[styles.actionText, styles.delete]}>Borrar</Text>
</TouchableOpacity>
</View>
</View>
))}
 <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal para agregar o editar pago */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false) 
          setCantidad('')
          setFecha('')
          setEditandoPago(null)
        }} 
      >
        <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <TextInput
            placeholder="Fecha (dd/mm/aaaa)"
            value={fecha}
            onChangeText={text => setFecha(text)}
            keyboardType="numeric"
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
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#423e67',
padding: 20,
},
container_title:{
marginTop: 70,
width: '80%',
height: 140,
borderRadius: 20,
backgroundColor: '#e2b989',
padding: 18,
marginBottom: 20,
},
heading: {
color: '#433e68',
fontSize: 20,
marginBottom: 5,
marginBottom: 10,
 
},
heading2: {
  fontSize: 15, 

},
paymentContainer: {
backgroundColor: '#e2b989',
borderRadius: 10,
padding: 10,
marginBottom: 10,
},
paymentText: {
fontSize: 12,
color: '#433e68',
},
actionsContainer: {
flexDirection: 'row',
justifyContent: 'flex-end',
marginTop: 5,
},
actionText: {
fontSize: 16,
marginRight: 10,
},
edit: {
  color: '#322b53',
},
delete: {
  color: '#322b53',
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
addButtonText: {
color: '#111',
fontSize: 24,
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
    borderBottomColor: '#ccc'
    }
    });