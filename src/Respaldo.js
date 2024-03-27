import React from 'react';
import { View, Text, Button, TouchableOpacity, Platform, Alert } from 'react-native'; // Importa Platform de react-native
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
import * as DocumentPicker from 'expo-document-picker';

const db = SQLite.openDatabase('data.db');

export default function Respaldo() {

    const handleBackup = async () => {
        try {
          const uri = FileSystem.documentDirectory + 'SQLite/' + db._db._name;
          const backupUri = FileSystem.cacheDirectory + 'data.db';
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
    <TouchableOpacity onPress={handleBackup} style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: 'bold', color: 'blue' }}>Exportar base de datos</Text>
      </TouchableOpacity>
    </View>
  );
}
