import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Modal, TextInput, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';

const ConfirmAccountScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedDishes } = route.params;
  const [dishes, setDishes] = useState(selectedDishes);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDish, setCurrentDish] = useState(null);
  const [observations, setObservations] = useState('');

  const total = Array.isArray(dishes) ? dishes.reduce((acc, dish) => acc + (dish.price * dish.quantity || 0), 0) : 0;

  const openModal = (dish) => {
    setCurrentDish(dish);
    setObservations(dish.notes || ''); // Asegúrate de usar 'notes' en lugar de 'observations'
    setModalVisible(true);
  };
  
  const updateDish = () => {
    setDishes(dishes.map(dish =>
      dish.name === currentDish.name
        ? { ...dish, quantity: currentDish.quantity, notes: observations } // Actualiza las observaciones
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
      <Image source={item.image} style={styles.dishIcon} />
      <Text style={styles.dishName}>{item.name}</Text>
      <Text style={styles.dishPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
      <Text style={styles.dishQuantity}>x{item.quantity}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Confirma la cuenta" />
      {/* Cambia el color de la barra de estado según el estado del modal */}
            <StatusBar
              barStyle={modalVisible ? 'dark-content' : 'light-content'}
              backgroundColor={modalVisible ? 'rgba(0,0,0,0.5)' : '#fff'}
            />
      <FlatList
        data={dishes}
        renderItem={renderDish}
        keyExtractor={(item) => item.name}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmText}>Confirmar</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {currentDish && (
              <>
                <View style={{flexDirection:'row', justifyContent: 'space-between', width:'80%'}}>
                  <Image source={currentDish.image} style={styles.modalImage} />
                  
                  <View style={{alignItems: 'center', justifyContent:"center"}}>
                    <Text style={styles.modalTitle}>{currentDish.name}</Text>
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
                  value={observations} // Muestra las observaciones actuales
                  onChangeText={setObservations} // Actualiza el estado de las observaciones
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
