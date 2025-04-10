import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import Logo from '../../assets/LogoBlanco.png';
import Header from '../components/Header';

export default function QrScreen() {
  const route = useRoute();
  const { ordenID, empleadoId, mesaId } = route.params;
  console.log("Empleado ID:", empleadoId);
  console.log("Mesa ID:", mesaId);
  const url = `http://localhost:5173/resena?empleadoId=${empleadoId}&mesaId=${mesaId}`;
  const navigation = useNavigation();

  const changestate = () => {
    console.log("Cambio de estado realizado");
    navigation.navigate('TablesScreen');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.title}>QR</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image source={Logo} style={styles.logo} />
        </View>
      </View>
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
  confirmButton: { 
    marginTop: 20,
    backgroundColor: '#9B1C31', 
    padding: 10, 
    borderRadius: 8 
  },
  confirmText: { 
    color: '#FFF', 
    fontWeight: 'bold' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    padding: 5,
    marginBottom:20,
    backgroundColor: '#a4113a',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
  },
  logo: {
    width: 45,
    height: 45,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});