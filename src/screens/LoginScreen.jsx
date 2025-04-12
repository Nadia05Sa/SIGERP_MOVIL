import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import LogoCompleto from '../../assets/LogoCompleto.png';
import { useNavigation } from '@react-navigation/native';
import { authenticate } from '../axiosConfig/axiosInterceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from 'react-native-vector-icons'; // Importar íconos

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try{
      
      setLoading(true);
      // Validación: Campos vacíos
      if (!email.trim() || !password.trim()) {
        Alert.alert('Error', 'Por favor, ingrese su correo y contraseña.');
        return;
      }

      // Validación: Formato de correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Por favor, ingrese un correo válido.');
        return;
      }

      // Validación: Longitud mínima de la contraseña
      if (password.length < 4) {
        Alert.alert('Error', 'La contraseña debe tener al menos 4 caracteres.');
        return;
      }

      const userData = await authenticate(email, password);
      console.log('User  data:', userData.estado);

      if (userData.estado === true) {
        // Almacenar datos del empleado en AsyncStorage
        await AsyncStorage.setItem('employeeData', JSON.stringify(userData));
        console.log('Login exitoso:', userData.estado);

        // Aquí puedes establecer el usuario en el contexto si lo estás usando
        navigation.navigate('TablesScreen');
      } else {
        Alert.alert('Error', 'Credenciales incorrectas.');
      }
    }catch (error) {
      console.error('Error en la autenticación:', error);
      Alert.alert('Error', 'Ocurrió un error durante la autenticación. Por favor, inténtelo de nuevo más tarde.');
    }finally {
      setLoading(false);
    }
    
  };
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={LogoCompleto} style={styles.logo} />
        
        <Text style={styles.label}>Correo:</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo"
          placeholderTextColor="#A0A0A0"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Text style={styles.label}>Contraseña:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#A0A0A0"
            secureTextEntry={!showPassword} // Controlar si la contraseña está visible
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)} // Cambiar el estado para mostrar/ocultar la contraseña
            style={styles.eyeIcon}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye' : 'eye-off'} // Cambiar el ícono según el estado
              size={24}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Continuar</Text>
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9B1C31',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.8,
  },  
  card: {
    backgroundColor: '#FFF',
    width: '80%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#9B1C31',
    paddingVertical: 5,
    marginBottom: 20,
    color: '#333',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    right: 30,
    top: -10,
  },
  button: {
    backgroundColor: '#9B1C31',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
}
});

export default LoginScreen;
