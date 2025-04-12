import React, { useState, useCallback, useRef, useEffect, use } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, FlatList, Image, Modal, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import { doDelete, doGet } from '../axiosConfig/axiosInterceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TablesScreen = () => {
    const [tables, setTables] = useState([]); // Estado para almacenar las mesas
    const [selectedTable, setSelectedTable] = useState(null); // Mesa seleccionada para mostrar en el modal
    const [modalVisible, setModalVisible] = useState(false); // Controla la visibilidad del modal
    const [loading, setLoading] = useState(true); // Estado de carga para mostrar un indicador de carga
    const [employeeData, setEmployeeData] = useState(null);
    const [ordenActiva, setOrdenActiva] = useState(false);
    const navigation = useNavigation(); // Hook para la navegación
    const isMounted = useRef(true); // Referencia para verificar si el componente está montado

    // Obtener los datos del empleado del almacenamiento local
    const getEmployeeData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('employeeData');
            if (jsonValue !== null) {
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

    // Cargar los datos del empleado cuando se monta el componente
    useEffect(() => {
        getEmployeeData();
        return () => {
            isMounted.current = false; // Limpieza al desmontar el componente
        };
    }, []);

    // Función para obtener las mesas del empleado logueado
    const fetchTables = useCallback(async () => {
        try {
            setLoading(true); // Inicia el estado de carga

            let currentEmployeeData = employeeData;
            if (!currentEmployeeData) {
                currentEmployeeData = await getEmployeeData();
            }

            if (!currentEmployeeData || !currentEmployeeData.id) {
                console.error('No se encontró el ID del empleado');
                Alert.alert('Error', 'No se pudo obtener la información del empleado. Por favor, inicia sesión nuevamente.');
                return;
            }

            // Hacer la llamada API para obtener las mesas de este empleado
            const response = await doGet(`/empleado/${currentEmployeeData.id}/mesas`);
            
            // Asegúrate de que la respuesta tenga la estructura correcta
            if (Array.isArray(response)) {
                const activeTables = response.filter(table => table.estado === true);
                setTables(activeTables); // Actualiza el estado con las mesas activas
            } else {
                Alert.alert('Error', 'No se pudieron obtener las mesas. Por favor, intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error al obtener mesas:', error);
            if (isMounted.current) {
                Alert.alert('Error', `No se pudieron obtener las mesas: ${error.message}`);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false); // Finaliza el estado de carga
            }
        }
    }, [employeeData]);

    // Efecto que se ejecuta al enfocar la pantalla
    useFocusEffect(
        useCallback(() => {
            fetchTables(); // Llama a la función para obtener las mesas
            return () => {};
        }, [fetchTables])
    );

    // Maneja la selección de una mesa
    const handlePressTable = useCallback(async (table) => {
        setSelectedTable(table);
        
        const esValida = await validarOrden(table.id);
        setOrdenActiva(esValida);
    
        setModalVisible(true);
    }, []);
    

    // Función para cerrar la mesa
    const closeTable = async (mesa) => {    
        try {
            if (!mesa) return;
            const orden = await doGet(`/mesas/${mesa.id}/orden`);
            console.log("Orden obtenida:", orden);
            if (!orden || !orden.id) {
                Alert.alert("Error", "No se encontró una orden activa para esta mesa.");
                return;
            }
            console.log("Cerrando mesa:", mesa.nombre);
            console.log("Orden a eliminar:", orden.id);
            // Llama a la función para eliminar la orden        
            Alert.alert(
                'Mesa cerrada',
                `La mesa ${mesa.nombre} ha sido cerrada.`,
                [{ text: 'Aceptar', onPress: deleteOrder(orden.id) }],
                { cancelable: false }
            );     
        } catch (error) {
            console.error("Error al cerrar la mesa:", error);
            Alert.alert("Error", "No se pudo cerrar la mesa.");
        }
    }
    
    const deleteOrder = async (ordenId) => {
        try {
            const response = await doDelete(`/ordenes/${ordenId}`);
            console.log("Orden eliminada:", response);
            if (response) {
                Alert.alert("Éxito", "La orden ha sido eliminada correctamente.");
                fetchTables(); // Refresca la lista de mesas después de eliminar la orden
            }

            setModalVisible(false);   

            return response;
        } catch (error) {
            console.error("Error al eliminar la orden:", error);
            Alert.alert("Error", "No se pudo eliminar la orden.");
            return null;
        }
    };

    // Navega a la pantalla para agregar platillos
    const handleAddDishes = useCallback(() => {
        if (!selectedTable) return;

        setModalVisible(false);
        console.log("Enviando a CreateAccountScreen con tableId:", selectedTable.id); // <- Verificación
        navigation.navigate('CreateAccountScreen', {
            tableId: selectedTable.id,
            tableName: selectedTable.nombre
        });
    }, [selectedTable, navigation]);

    const validarOrden = async (tableId) => {
        try {
            let ordenExistente;
            try {
                ordenExistente = await doGet(`/mesas/${tableId}/orden`);
                console.log("Orden obtenida:", ordenExistente);

            } catch (error) {
                console.error('Error al obtener la orden:', error);
                if (error.response?.status === 204 || error.response?.status === 404) {
                    return false;
                } else {
                    throw error;
                }
            }
    
            return ordenExistente && ordenExistente.estado === true;
        } catch (error) {
            console.error('Error al validar la orden:', error);
            Alert.alert('Error', 'No se pudo validar la orden. Por favor, intenta de nuevo.');
            return false;
        }
    };
    
    // Navega a la pantalla de cuenta
    const handleViewAccount = useCallback(() => {
        if (!selectedTable) return;
    
        validarOrden(selectedTable.id).then((esValida) => {
            if (esValida) {
                setModalVisible(false); // Cierra el modal
                console.log("Enviando a AccountScreen con tableId:", selectedTable.id); 
                navigation.navigate('AccountScreen', {
                    tableId: selectedTable.id,
                    tableName: selectedTable.nombre
                });
            } else {
                Alert.alert("Sin cuenta activa", "No hay una orden activa para esta mesa.");
            }
        });
    }, [selectedTable, navigation]);
    

    // Maneja la acción de cerrar la mesa
    const handleCloseTable = useCallback(() => {
        if (!selectedTable) return;
    
        validarOrden(selectedTable.id).then((esValida) => {
            if (esValida) {
                closeTable(selectedTable); // Cierra la mesa
            } else {
                Alert.alert("Sin cuenta activa", "No hay una orden activa para esta mesa.");
            }
        });
    }, [selectedTable, closeTable]);

    // Renderiza cada elemento de la lista de mesas
    const renderItem = useCallback(({ item }) => (
        <TouchableOpacity
            style={[styles.tableItem, styles.tableEnabled]}
            onPress={() => handlePressTable(item)} // Maneja la selección de la mesa
            disabled={!item.estado} // Deshabilita la mesa si está cerrada
        >
            <Image
                source={
                    item.imagen
                        ? { uri: item.imagen }
                        : require('../../assets/mesa-de-comedor.png')
                }
                defaultSource={require('../../assets/mesa-de-comedor.png')}
                style={[styles.icon, { }]}
            />
            <Text style={[styles.tableText, { color: '#9B1C31' }]}>
                {item.nombre || 'Mesa sin nombre'}
            </Text>
        </TouchableOpacity>
    ), [handlePressTable]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#9B1C31" />
                <Text>Cargando mesas...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar 
                barStyle={modalVisible ? 'dark-content' : 'light-content'} 
                backgroundColor={modalVisible ? 'rgb(83, 1, 29)' : '#a4113a'} 
            />
            <Header 
                title="Mesas disponibles" 
                rightAction={fetchTables} // Acción para refrescar la lista de mesas
                rightIcon="refresh"
            />           

            {tables.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No hay mesas disponibles</Text>
                    <TouchableOpacity 
                        style={styles.refreshButton}
                        onPress={fetchTables} // Refresca la lista de mesas
                    >
                        <Text style={styles.refreshButtonText}>Actualizar</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={tables}
                    renderItem={renderItem} // Renderiza las mesas
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    numColumns={2}
                    refreshing={loading} // Estado de carga para el FlatList
                    onRefresh={fetchTables} // Refresca la lista al hacer pull
                />
            )}

            <Modal                
                animationType="slide"
                transparent={true}
                visible={modalVisible && selectedTable !== null} // Muestra el modal si está visible y hay una mesa seleccionada
                onRequestClose={() => setModalVisible(false)} // Cierra el modal al presionar el botón de retroceso
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Mesa {selectedTable?.nombre}</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={handleAddDishes}>
                            <Text style={styles.modalButtonText}>Agregar platillos</Text>
                        </TouchableOpacity>
                        {ordenActiva && (
                            <>
                            <TouchableOpacity style={styles.modalButton} onPress={handleViewAccount}>
                                <Text style={styles.modalButtonText}>Ver cuenta</Text>
                            </TouchableOpacity><TouchableOpacity style={styles.modalButton} onPress={handleCloseTable}>
                                <Text style={styles.modalButtonText}>Cancelar Orden</Text>
                            </TouchableOpacity>
                            </>
                        )}
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    listContainer: { marginTop: -10, alignItems: 'center' },
    tableItem: { width: 170, height: 170, backgroundColor: '#FFF', borderRadius: 25, justifyContent: 'center', alignItems: 'center', margin: 10, borderWidth: 2, borderColor: '#DDD', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 8 },
    tableEnabled: { borderColor: '#9B1C31', backgroundColor: '#F8E1E7' },
    icon: { width: 100, height: 100 },
    tableText: { marginTop: 5, fontSize: 16, fontWeight: 'bold', color: '#000' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalView: { backgroundColor: 'white', borderRadius: 10, padding: 20, width: '80%', alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    modalButton: { backgroundColor: '#9B1C31', padding: 10, borderRadius: 5, marginVertical: 5, width: '100%', alignItems: 'center' },
    modalButtonText: { color: '#FFF', fontWeight: 'bold' },
    cancelButton: { backgroundColor: '#999', padding: 10, borderRadius: 5, marginTop: 10, width: '100%', alignItems: 'center' },
    cancelButtonText: { color: '#FFF', fontWeight: 'bold' },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyStateText: { fontSize: 18, marginBottom: 10 },
    refreshButton: { backgroundColor: '#9B1C31', padding: 10, borderRadius: 5 },
    refreshButtonText: { color: '#FFF', fontWeight: 'bold' },
    logo: { width: 45, height: 45 },
    title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
});

export default TablesScreen;