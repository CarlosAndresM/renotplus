// ActividadesSeleccionables.js
import React from 'react';
import { View, Button } from 'react-native';

export default function ActividadesPagadas({ navigation }) {
  return (
    <View>
      <Button title="Aseo" onPress={() => navigation.navigate('ListaUsuarios', { activityId: 1 })} />
      <Button title="Campamento" onPress={() => navigation.navigate('ListaUsuarios', { activityId: 2 })} />
      <Button title="Libro" onPress={() => navigation.navigate('ListaUsuarios', { activityId: 3 })} />
      <Button title="Otros" onPress={() => navigation.navigate('ListaUsuarios', { activityId: 4 })} />
    </View>
  );
}
