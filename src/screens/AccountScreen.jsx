import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, StatusBar, Modal, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import { doGet } from '../axiosConfig/axiosInterceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountScreen = () => {
  const [dishes, setDishes] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [dishToAdd, setDishToAdd] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [ordenId, setOrdenId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null); // ✅ Guardar el ID del empleado

  const navigation = useNavigation();
  const route = useRoute();
  const { tableId, tableName } = route.params || {};

  const total = selectedDishes.reduce((acc, dish) => acc + (dish.precio * dish.quantity || 0), 0);

  useEffect(() => {
    const initData = async () => {
      const empId = await fetchEmployeeId();
      setEmployeeId(empId); // ✅ Almacenar empleadoId
      fetchOrdenByMesaId();
    };
    initData();
  }, []);

  const fetchEmployeeId = async () => {
    const jsonValue = await AsyncStorage.getItem('employeeData');
    if (jsonValue) {
      const data = JSON.parse(jsonValue);
      return data.id;
    }
    return null;
  };

  const fetchOrdenByMesaId = async () => {
    try {
      console.log('Fetching order for table ID:', tableId);
      const data = await doGet(`/mesas/${tableId}/orden`);
      console.log('Orden data:', data);
      if (data && data.id) {
        const detallesFormateados = data.detalles.map(detalle => ({
          ...detalle.producto,
          quantity: detalle.cantidad,
          notes: detalle.detalle,
        }));
        setDishes(detallesFormateados);
        setOrdenId(data.id);
        await AsyncStorage.setItem('cuenta_id', data.id);
      } else {
        console.log('No hay una orden creada aún');
        Alert.alert('Información', 'No hay una orden creada aún');
      }
    } catch (error) {
      console.error('Error al obtener la orden vinculada a la mesa:', error);
      Alert.alert('Error', 'No se pudo obtener la orden vinculada a la mesa');
    }
  };
  
  const handleSelectDish = (dish) => {
    setDishToAdd(dish);
    setQuantity(1);
    setNotes('');
    setModalVisible(true);
  };

  const handleConfirmAddDish = () => {
    setSelectedDishes((prev) => {
      const existingDish = prev.find(dish => dish.id === dishToAdd.id);
      if (existingDish) {
        return prev.map(dish =>
          dish.id === dishToAdd.id
            ? { ...dish, quantity: dish.quantity + quantity, notes: notes || dish.notes }
            : dish
        );
      } else {
        return [...prev, { ...dishToAdd, quantity, notes }];
      }
    });
    setModalVisible(false);
    setDishToAdd(null);
    setQuantity(1);
    setNotes('');
  };

  const handleGoToCart = async () => {
    try {
      if (!ordenId) {
          Alert.alert('Error', 'No hay una orden activa para actualizar');
          return;
      }

      const response = await doGet(`/ordenes/${ordenId}/estado`);
      if (response.status === 200) {
          Alert.alert('Éxito', 'El estado de la orden se ha actualizado');
          fetchOrdenByMesaId(); // Volver a obtener la orden actualizada
          navigation.navigate('QrScreen', {
            ordenId,
            empleadoId: employeeId,
            mesaId: tableId
          });
      } else {
          throw new Error('No se pudo actualizar el estado');
      }
    } catch (error) {
        console.error('Error al actualizar el estado de la orden:', error);
        Alert.alert('Error', 'No se pudo actualizar el estado de la orden');
    }
  };

  return (
    <View style={styles.container}>
      <Header title={`Cuenta - ${tableName}`} />

      <StatusBar
        barStyle={modalVisible ? 'dark-content' : 'light-content'}
        backgroundColor={modalVisible ? 'rgb(83, 1, 29)' : '#a4113a'}
      />



      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar platillo"
          value={search}
          onChangeText={setSearch}
          style={styles.searchBar}
        />
      </View>

      <FlatList
        data={dishes.filter(dish => dish.nombre.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectDish(item)} style={styles.dishItem}>
            <Image source={{ uri: item.imagen }} style={styles.dishIcon} />
            <View style={styles.dishDetails}>
              <Text style={styles.dishName}>{item.nombre}</Text>
              <Text style={styles.dishDescription}>${item.precio}</Text>
              <Text style={styles.dishDescription}>Cantidad: {item.quantity || 0}</Text>
              <Text style={styles.dishDescription}>Notas: {item.notes || 'N/A'}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
        <TouchableOpacity style={styles.confirmButton} onPress={handleGoToCart}>
          <Text style={styles.confirmText}>Liberar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {dishToAdd && (
              <>
                <Image source={{ uri: dishToAdd.imagen }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{dishToAdd.nombre}</Text>

                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityButton}>Cantiad: {quantity}</Text>
                  <Text style={styles.quantityButton}>Precio: {dishToAdd.precio}</Text>
                </View>
                
                <Text style={styles.quantityButton}>Notas: {dishToAdd.notes || 'N/A'}</Text>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cerrar</Text>
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
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBar: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#9B1C31',
  },
  categoryContainer: {
    marginVertical: 10,
  },
  categoryItem: {
    backgroundColor: '#FFF',
    padding: 8,
    width: 110,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedCategory: {
    backgroundColor: '#F8E1E7',
    borderColor: '#9B1C31',
  },
  categoryText: {
    color: '#000',
    fontWeight: '400',
  },
  selectedCategoryText: {
    color: '#000',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  dishItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
    width: '90%',
  },
  dishIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  dishDetails: {
    flex: 1,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dishDescription: {
    fontSize: 14,
    color: '#666',
  },
  cartButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#9B1C31',
    padding: 15,
    borderRadius: 50,
  },
  cartIcon: {
    width: 30,
    height: 30,
    tintColor: '#FFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'between',
    justifyContent: 'between',
    marginVertical: 10,
  },
  quantityButton: {
    fontSize: 18,
    paddingHorizontal: 10,
    color: '#000',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  observationsInput: {
    width: '100%',
    height: 60,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  confirmButton: {
    backgroundColor: '#9B1C31',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#DDD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: 'bold',
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
});

export default AccountScreen;