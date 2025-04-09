import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Modal, TextInput, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import axios from 'axios'; // Importa Axios

const ConfirmAccountScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedDishes } = route.params;
  const [dishes, setDishes] = useState(selectedDishes);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDish, setCurrentDish] = useState(null);
  const [observations, setObservations] = useState('');

  const total = Array.isArray(dishes) ? dishes.reduce((acc, dish) => acc + (dish.precio * dish.quantity || 0), 0) : 0;

  const openModal = (dish) => {
    setCurrentDish(dish);
    setObservations(dish.notes || '');
    setModalVisible(true);
  };

  const handleGoToCart = async () => {
    const data = {
      fecha: new Date().toISOString().split('T')[0], // Fecha actual
      estado: "pendiente",
      comentario: observations, // Usa las observaciones como comentario
      cantidad: total, // Total de la cuenta
      mesa: {
        id: "67dc32145e484c4bd8c960cc" // Cambia esto según tu lógica
      },
      productos: dishes.map(dish => ({
        id: dish.id // Asegúrate de que cada plato tenga un id
      }))
    };

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/api/ordenes',
      headers: { 
        'Content-Type': 'application/json', 
        'Cookie': 'JSESSIONID=220D34D5E2E37CEB9588C90C1B435D8D'
      },
      data: JSON.stringify(data)
    };

    try {
      const response = await axios.request(config);
      console.log('Respuesta del servidor:', JSON.stringify(response.data));
      // Aquí puedes navegar a otra pantalla o mostrar un mensaje de éxito
      navigation.pop(2); // Regresa a la pantalla anterior
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      // Maneja el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  const updateDish = () => {
    setDishes(dishes.map(dish =>
      dish.name === currentDish.name
        ? { ...dish, quantity: currentDish.quantity, notes: observations }
        : dish
    ));
    closeModal();
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentDish(null);
  };

  const incrementQuantity = () => {
    setCurrentDish({ ...currentDish, quantity: currentDish.quantity + 1 });
  };

  const decrementQuantity = () => {
    if (currentDish.quantity > 1) {
      setCurrentDish({ ...currentDish, quantity: currentDish.quantity - 1 });
    }
  };

  const renderDish = ({ item }) => (
    <TouchableOpacity style={styles.dishItem} onPress={() => openModal(item)}>
      <Image source={{ uri: item.imagen }} style={styles.dishIcon} />
      <Text style={styles.dishName}>{item.nombre}</Text>
      <Text style={styles.dishPrice}>${(item.precio * item.quantity).toFixed(2)}</Text>
      <Text style={styles.dishQuantity}>x{item.quantity}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Confirma la cuenta" />
      <StatusBar barStyle={modalVisible ? 'dark-content' : 'light-content'} backgroundColor={modalVisible ? 'rgb(83, 1, 29)' : '#a4113a'} />
  
      <FlatList
        data={dishes}
        renderItem={renderDish}
        keyExtractor={(item) => item.id.toString()}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.confirmButton} onPress={handleGoToCart}>
          <Text style={styles.confirmText}>Confirmar</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {currentDish && (
              <>
                <View style={{flexDirection:'row', justifyContent: 'space-between', width:'90%'}}>
                  <Image source={{ uri: currentDish.imagen }} style={styles.modalImage} />
                  <View style={{alignItems: 'center', justifyContent:"center"}}>
                    <Text style={styles.modalTitle}>{currentDish.nombre}</Text>
                    <View style={styles.counterContainer}>
                      <TouchableOpacity style={styles.counterButton} onPress={decrementQuantity}><Text>-</Text></TouchableOpacity>
                      <Text style={styles.counterText}>{currentDish.quantity}</Text>
                      <TouchableOpacity style={styles.counterButton} onPress={incrementQuantity}><Text>+</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>
                
                <TextInput
                  style={styles.input}
                  placeholder="Observaciones"
                  placeholderTextColor="#A0A0A0"
                  multiline
                  value={observations}
                  onChangeText={setObservations}
                />
                <View style={{flexDirection:'row', justifyContent: 'space-between', width:'80%'}}>
                  <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={updateDish}>
                    <Text style={styles.buttonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5' 
  },
  dishItem: { 
    flexDirection: 'row', 
    padding: 10, 
    backgroundColor: '#FFF', 
    margin: 5, 
    borderRadius: 10 
  },
  dishIcon: { 
    width: 40, 
    height: 40, 
    marginRight: 10 
  },
  dishName: { 
    flex: 1, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  dishPrice: { 
    fontSize: 14, 
    color: '#9B1C31' 
  },
  dishQuantity: { 
    fontSize: 14 
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 10, 
    backgroundColor: '#FFF' 
  },
  totalText: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  confirmButton: { 
    backgroundColor: '#9B1C31', 
    padding: 10, 
    borderRadius: 8 
  },
  confirmText: { 
    color: '#FFF', 
    fontWeight: 'bold' 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalView: { 
    backgroundColor: 'white', 
    padding: 20, 
    width: '80%',
    borderRadius: 10, 
    alignItems: 'center' 
  },
  modalImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  modalPrice: { 
    fontSize: 16, 
    marginBottom: 10 
  },
  counterContainer: { 
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#DDD',
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10,
  },
  counterButton: { 
    padding: 10 
  },
  counterText: { 
    marginHorizontal: 10, 
    fontSize: 18 
  },
  input: { 
    width: '100%',
    height: 60,
    borderWidth: 1, 
    borderColor: '#DDD', 
    marginBottom: 10, 
    padding: 10, 
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  button: { 
    backgroundColor: '#9B1C31', 
    padding: 10, 
    borderRadius: 5, 
    marginTop: 10 
  },
  cancelButton: {
    backgroundColor: '#999', 
    padding: 10, 
    borderRadius: 5, 
    marginTop: 10 
  },
  buttonText: { 
    color: '#FFF', 
    fontWeight: 'bold' 
  },
});

export default ConfirmAccountScreen;
