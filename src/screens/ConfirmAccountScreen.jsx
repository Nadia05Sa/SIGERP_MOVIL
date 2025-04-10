import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Modal, TextInput, StatusBar, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import { doPost, doGet, doPatch } from '../axiosConfig/axiosInterceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfirmAccountScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedDishes, tableId } = route.params;
  console.log("tableId:", tableId);

  const [dishes, setDishes] = useState(selectedDishes);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDish, setCurrentDish] = useState(null);
  const [observations, setObservations] = useState('');
  const [employeeData, setEmployeeData] = useState(null);
  const [ordenMesa, setOrdenMesa] = useState(null);
  const isMounted = useRef(true);

  const total = dishes.reduce((acc, { precio, quantity }) => acc + precio * (quantity || 0), 0);

  const openModal = (dish) => {
    setCurrentDish(dish);
    setObservations(dish.notes || '');
    setModalVisible(true);
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

  const updateDish = () => {
    setDishes(dishes.map(dish =>
        dish.id === currentDish.id
            ? { ...dish, quantity: currentDish.quantity, notes: observations }
            : dish
    ));
    closeModal();
  };

  const mostrarError = (titulo, mensaje) => {
    Alert.alert(titulo, mensaje, [{ text: 'OK' }]);
  };

  const getEmployeeData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('employeeData');
      if (jsonValue) {
        const data = JSON.parse(jsonValue);
        setEmployeeData(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener datos del empleado:', error);
      return null;
    }
  };

  useEffect(() => {
    getEmployeeData();
    return () => { isMounted.current = false; };
  }, []);
  
  const handleGoToCart = async () => {
    try {
        const currentEmployeeData = employeeData || await getEmployeeData();

        if (!currentEmployeeData?.id) {
            mostrarError('Error', 'No se pudo obtener la información del empleado. Por favor, inicia sesión nuevamente.');
            return;
        }

        if (!tableId) {
            mostrarError('Error', 'No se ha seleccionado una mesa. Verifica e intenta nuevamente.');
            return;
        }

        const detalles = dishes.map(dish => ({
            producto: { id: dish.id },
            cantidad: dish.quantity,
            detalle: dish.notes || ''
        }));

        const ordenData = {
            fecha: new Date().toISOString(),
            estado: true,
            comentario: '',
            mesa: { id: tableId },
            detalles: detalles
        };

        let ordenExistente;

        try {
            ordenExistente = await doGet(`/mesas/${tableId}/orden`);
        } catch (error) {
            if (error.response?.status === 204) {
                ordenExistente = null;
            }
        }

        if (ordenExistente) {
            const detallesActualizados = [...ordenExistente.detalles, ...ordenData.detalles];
            const dataActualizada = { ...ordenExistente, detalles: detallesActualizados };

            await doPatch(`/ordenes/${ordenExistente.id}`, dataActualizada);
            Alert.alert('Orden actualizada', 'Se agregaron los nuevos platillos a la cuenta.');
        } else {
            const ordenCreada = await doPost('/ordenes', ordenData);
            Alert.alert('Orden creada', 'Se ha creado una nueva cuenta para la mesa.');
            console.log('Orden creada:', ordenCreada);
            const mesa = await doGet(`/mesas/${tableId}`);
            const mesaActualizada = { ...mesa, orden: ordenCreada };
            console.log('Mesa actualizada:', mesaActualizada);
            await doPatch(`/mesas/${tableId}`, mesaActualizada);
            
        }

        navigation.pop(2);
    } catch (error) {
        console.error('❌ Error al procesar la orden:', error);
    }
};

  
  return (
      <View style={styles.container}>
        <Header title="Confirma la cuenta" />
        <StatusBar barStyle={modalVisible ? 'dark-content' : 'light-content'} backgroundColor={modalVisible ? 'rgb(83, 1, 29)' : '#a4113a'} />

        {ordenMesa && (
            <View style={styles.ordenContainer}>
              <Text style={styles.ordenTitle}>Orden actual en la mesa:</Text>
              {ordenMesa.detalles.map((detalle, index) => (
                  <Text key={index} style={styles.ordenItem}>
                    {detalle.producto?.nombre} x{detalle.cantidad}
                  </Text>
              ))}
            </View>
        )}

        <FlatList
            data={dishes}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.dishItem} onPress={() => openModal(item)}>
                  <Image source={{ uri: item.imagen }} style={styles.dishIcon} />
                  <Text style={styles.dishName}>{item.nombre}</Text>
                  <Text style={styles.dishPrice}>${(item.precio * item.quantity).toFixed(2)}</Text>
                  <Text style={styles.dishQuantity}>x{item.quantity}</Text>
                </TouchableOpacity>
            )}
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
                      <Image source={{ uri: currentDish.imagen }} style={styles.modalImage} />
                      <View style={{ alignItems: 'center', justifyContent: "center" }}>
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}>
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