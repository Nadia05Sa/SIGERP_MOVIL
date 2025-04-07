import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRoute } from '@react-navigation/native';

export default function QrScreen() {
  //const route = useRoute();
  //const { mesero } = route.params;

  const url = `https://google.com`;
    {/* const url = `https://miapp.com/resena?mesero=${encodeURIComponent(mesero)}`; */}

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20, fontSize: 18 }}>QR para {/*{mesero}*/}</Text>
      <QRCode value={url} size={200} />
    </View>
  );
}
