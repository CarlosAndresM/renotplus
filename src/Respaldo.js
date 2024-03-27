import React from 'react';
import { View, Text, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';

const db = SQLite.openDatabase('database.db');

export default function Respaldo() {
  const handleBackup = async () => {
    try {
      const uri = FileSystem.documentDirectory + 'SQLite/' + db._db._name;
      const backupUri = FileSystem.cacheDirectory + 'database.db';
      await FileSystem.copyAsync({ from: uri, to: backupUri });

      const message = {
        subject: 'Copia de seguridad de la base de datos',
        body: 'Adjuntamos la copia de seguridad de la base de datos.',
        attachments: [backupUri],
      };

      MailComposer.composeAsync(message);
    } catch (error) {
      console.error('Error al crear la copia de seguridad:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Generar copia de seguridad y enviar por correo electrónico</Text>
      <Button title="Generar Copia de Seguridad" onPress={handleBackup} />
    </View>
  );
}
