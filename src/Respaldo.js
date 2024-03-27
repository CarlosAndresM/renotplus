import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';

const db = SQLite.openDatabase('Data.db');

export default function Respaldo() {

  const handleBackup = async () => {
    try {
      const uri = FileSystem.documentDirectory + 'SQLite/' + db._db._name;
      const backupUri = FileSystem.cacheDirectory + 'Data.db';
      await FileSystem.copyAsync({ from: uri, to: backupUri });

    
      const date = new Date(); 


      const message = {
        subject: 'Copia de seguridad de la base de datos',
        body: `Adjunto copia de seguridad de la base de datos, exportada el dia ${date}.`,
        attachments: [backupUri],
      };

      await MailComposer.composeAsync(message);
    } catch (error) {
      console.error('Error al crear la copia de seguridad:', error);
    }
  };

  return (
    <View style={styles.mainScreenContainer}>
      <TouchableOpacity onPress={handleBackup} style={styles.button}>
        <Text style={styles.buttonText}>Exportar base de datos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#423e67',
  },
  button: {
    backgroundColor: '#e2b989',
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#423e67',
  },
});
