import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, StatusBar, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { doGet } from '../axiosConfig/axiosInterceptor';

const AccountScreen = () => {
    const [dishes, setDishes] = useState([]);
    const [selectedDishes, setSelectedDishes] = useState([]);
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [dishToAdd, setDishToAdd] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const navigation = useNavigation();
    
    const total = Array.isArray(selectedDishes) 
    ? selectedDishes.reduce((acc, dish) => acc + (dish.precio * dish.quantity || 0), 0) 
    : 0;
    
    useEffect(() => {
      fetchDishes();
    }, []);
  
    // Función para obtener todos los platillos desde la API
    const fetchDishes = async () => {
      try {
        const data = await doGet('/producto');
        setDishes(data);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };
  
    // Maneja la selección de un platillo y abre el modal para agregarlo
    const handleSelectDish = (dish) => {
      setDishToAdd(dish);
      setQuantity(1);
      setNotes('');
      setModalVisible(true);
    };
  
    // Confirma la adición del platillo seleccionado a la lista
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
  
    // Navega a la pantalla de confirmación con los platillos seleccionados
    const handleGoToCart = () => {
      navigation.navigate('QrScreen');
    };
  
    return (
      <View style={styles.container}>
        <Header title="Genera una cuenta" />
        
        <StatusBar barStyle={modalVisible ? 'dark-content' : 'light-content'} backgroundColor={modalVisible ? 'rgb(83, 1, 29)' : '#a4113a'} />
        
        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar platillo"
            placeholderTextColor="#A0A0A0"
            value={search}
            onChangeText={setSearch}
          />
        </View>
  
        {/* Mostrar los platos con el filtro de búsqueda */}
        <FlatList
          data={dishes.filter(dish => dish.nombre.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.dishItem} onPress={() => handleSelectDish(item)}>
              <Image source={{ uri: item.imagen }} style={styles.dishIcon} />
              <View style={styles.dishDetails}>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <Text style={styles.dishName}>{item.nombre}</Text>
                  <Text style={styles.dishName}>${item.precio}</Text>
                </View>
                <Text style={styles.dishDescription}>{item.descripcion}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.flatListContent}
          style={styles.flatList}
        />
  
        
        <View style={styles.footer}>
            <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmText}  onPress={handleGoToCart} >Liberar</Text>
            </TouchableOpacity>
        </View>
  
        {/* Modal para agregar cantidad y notas al platillo */}
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
                  {/* Imagen, nombre y control de cantidad */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
                    <Image source={{ uri: dishToAdd.imagen }} style={styles.modalImage} />
                    <View style={{ alignItems: 'center', justifyContent: "center" }}>
                      <Text style={styles.modalTitle}>{dishToAdd.nombre}</Text>
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                          <Text style={styles.quantityButton}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                          <Text style={styles.quantityButton}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
  
                  {/* Input para observaciones */}
                  <TextInput
                    style={styles.observationsInput}
                    placeholder="Añadir observaciones..."
                    placeholderTextColor="#A0A0A0"
                    multiline
                    value={notes}
                    onChangeText={setNotes}
                  />
  
                  {/* Botón para confirmar y agregar platillo */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmAddDish}>
                      <Text style={styles.confirmButtonText}>Agregar</Text>
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