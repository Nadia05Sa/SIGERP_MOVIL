import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, StatusBar, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // ✅ Importar useRoute
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
      console.log('Empleado ID:', empId);
      console.log('Mesa ID:', tableId);

      const storedOrdenId = await AsyncStorage.getItem('cuenta_id');
      setOrdenId(storedOrdenId);
      fetchOrdenById(storedOrdenId);
    };
    initData();
    fetchDishes();
  }, []);

  const fetchEmployeeId = async () => {
    const jsonValue = await AsyncStorage.getItem('employeeData');
    if (jsonValue) {
      const data = JSON.parse(jsonValue);
      return data.id;
    }
    return null;
  };

  const fetchDishes = async () => {
    try {
      const data = await doGet('/producto');
      setDishes(data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  const fetchOrdenById = async (ordenId) => {
    try {
      const data = await doGet(`/ordenes/${ordenId}`);
      if (data?.platillos) {
        const platillosConCantidad = data.platillos.map(p => ({
          ...p,
          quantity: p.quantity || 1,
          notes: p.notes || ''
        }));
        setSelectedDishes(platillosConCantidad);
      }
    } catch (error) {
      console.error('Error al obtener la orden:', error);
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

  const handleGoToCart = () => {
    navigation.navigate('QrScreen', {
      ordenId,
      empleadoId: employeeId,
      mesaId: tableId
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header title={`Cuenta - ${tableName}`} />
      <Text>Total: €{total.toFixed(2)}</Text>
      {/* Aquí podrías renderizar los platillos y el botón para continuar */}
      <TouchableOpacity onPress={handleGoToCart}>
        <Text>Ver QR / Confirmar pedido</Text>
      </TouchableOpacity>
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
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#DDD',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: '#DDD',
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