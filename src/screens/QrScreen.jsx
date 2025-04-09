import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRoute } from '@react-navigation/native';
import Header from '../components/Header';

export default function QrScreen() {
  const route = useRoute();
  const { ordenID, empleadoId, mesaId } = route.params;
  console.log("Empleado ID:", empleadoId);
  console.log("Mesa ID:", mesaId);
  const url = `http://localhost:5173/resena?empleadoId=${empleadoId}&mesaId=${mesaId}`;

  const changestate = () => {
    console.log("Cambio de estado realizado");
  }

  return (
    <View style={styles.container}>
      <Header title="QR" />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Escanea el QR</Text>
        <QRCode value={url} size={300} />
        <TouchableOpacity style={styles.confirmButton} onPress={changestate}>
          <Text style={styles.confirmText}>Liberado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});