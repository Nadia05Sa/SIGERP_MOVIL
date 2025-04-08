import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, FlatList, Image, Modal, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import { doGet } from '../axiosConfig/axiosInterceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TablesScreen = () => {
    const [tables, setTables] = useState([]); // Estado para almacenar las mesas
    const [selectedTable, setSelectedTable] = useState(null); // Mesa seleccionada para mostrar en el modal
    const [modalVisible, setModalVisible] = useState(false); // Controla la visibilidad del modal
    const [loading, setLoading] = useState(true); // Estado de carga para mostrar un indicador de carga
    const [employeeData, setEmployeeData] = useState(null); // Datos del empleado
    const navigation = useNavigation(); // Hook para la navegación
    const isMounted = useRef(true); // Referencia para verificar si el componente está montado

    // Obtener los datos del empleado del almacenamiento local
    const getEmployeeData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('employeeData');
            if (jsonValue !== null) {
                const data = JSON.parse(jsonValue);
                setEmployeeData(data); // Almacena los datos del empleado en el estado
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
                currentEmployeeData = await getEmployeeData(); // Obtiene los datos del empleado si no están en el estado
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
                const activeTables = response.filter(table => table.estado === true); // Filtra las mesas activas
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
    const handlePressTable = useCallback((table) => {
        setSelectedTable(table); // Establece la mesa seleccionada
        setModalVisible(true); // Muestra el modal
    }, []);

    // Función para cerrar la mesa
    const closeTable = useCallback(async (table) => {
        try {
            setModalVisible(false); // Cierra el modal
            setLoading(true); // Inicia el estado de carga
            
            // Aquí debes implementar la llamada a la API para cerrar la mesa
            // await doPatch(`/mesas/${table.id}/cerrar`);
            
            // Simulación de cierre de mesa
            const updatedTables = tables.map(t => 
                t.id === table.id ? { ...t, estado: false } : t
            );
            setTables(updatedTables); // Actualiza el estado de las mesas

            Alert.alert("Éxito", `La mesa ${table.nombre} ha sido cerrada correctamente.`);
            navigation.navigate('QrScreen', { tableId: table.id }); // Redirige a QrScreen
        } catch (error) {
            console.error('Error al cerrar la mesa:', error);
            Alert.alert('Error', 'No se pudo cerrar la mesa. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    }, [tables, navigation]);

    // Navega a la pantalla para agregar platillos
    const handleAddDishes = useCallback(() => {
        if (!selectedTable) return;
        
        setModalVisible(false); // Cierra el modal
        navigation.navigate('CreateAccountScreen', {
            tableId: selectedTable.id,
            tableName: selectedTable.nombre
        });
    }, [selectedTable, navigation]);

    // Navega a la pantalla de cuenta
    const handleViewAccount = useCallback(() => {
        if (!selectedTable) return;
        
        setModalVisible(false); // Cierra el modal
        navigation.navigate('AccountScreen', {
            tableId: selectedTable.id,
            tableName: selectedTable.nombre
        });    
    }, [selectedTable, navigation]);

    // Maneja la acción de cerrar la mesa
    const handleCloseTable = useCallback(() => {
        if (!selectedTable) return;

        Alert.alert(
            'Cerrar mesa',
            `¿Estás seguro de que deseas cerrar la mesa ${selectedTable.nombre}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar', onPress: () => closeTable(selectedTable) } // Cierra la mesa si se confirma
            ]
        );
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
                style={[styles.icon, { tintColor: '#9B1C31' }]}
            />
            <Text style={[styles.tableText, { color: '#9B1C31' }]}>
                {item.nombre || 'Mesa sin nombre'}
            </Text>
        </TouchableOpacity>
    ), [handlePressTable]);

    // Muestra un indicador de carga mientras se obtienen las mesas
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
                title="Tus mesas" 
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
                    keyExtractor={(item) => `mesa-${item.id}`} // Clave única para cada mesa
                    numColumns={2} // Número de columnas en la lista
                    contentContainerStyle={styles.listContainer}
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
                        <Text style={styles.modalTitle}>
                            Opciones para {selectedTable?.nombre || 'la mesa'}
                        </Text>
                        <TouchableOpacity style={styles.modalButton} onPress={handleAddDishes}>
                            <Text style={styles.modalButtonText}>Agregar platillos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={handleViewAccount}>
                            <Text style={styles.modalButtonText}>Ver cuenta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={handleCloseTable}>
                            <Text style={styles.modalButtonText}>Cerrar mesa</Text>
                        </TouchableOpacity>
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
});

export default TablesScreen;