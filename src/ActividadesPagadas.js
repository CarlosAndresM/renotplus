import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

export default function ActividadesPagadas({ navigation }) {
  return (
    <View style={styles.mainScreenContainer}>

      <View style={styles.linkContainer}>
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('ListaUsuarios', { activityId: 1 })}>
          <Text style={styles.linkText}>Aseo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('ListaUsuarios', { activityId: 2 })}>
          <Text style={styles.linkText}>Campamento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('ListaUsuarios', { activityId: 3 })}>
          <Text style={styles.linkText}>Libro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('ListaUsuarios', { activityId: 4 })}>
          <Text style={styles.linkText}>Otros</Text>
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
