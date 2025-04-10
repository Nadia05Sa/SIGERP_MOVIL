
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, FlatList, Image, Modal, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import { doGet } from '../axiosConfig/axiosInterceptor';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TablesScreen = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [employeeData, setEmployeeData] = useState(null);
    const navigation = useNavigation();
    const isMounted = useRef(true);

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

    useEffect(() => {
        getEmployeeData();
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchTables = useCallback(async () => {
        try {
            setLoading(true);
            
            let currentEmployeeData = employeeData;
            if (!currentEmployeeData) {
                currentEmployeeData = await getEmployeeData();
            }
            
            if (!currentEmployeeData || !currentEmployeeData.id) {
                console.error('No se encontró el ID del empleado');
                Alert.alert('Error', 'No se pudo obtener la información del empleado. Por favor, inicia sesión nuevamente.');
                return;
            }
            
            const response = await doGet(`/empleado/${currentEmployeeData.id}/mesas`);
            
            if (Array.isArray(response)) {
                const activeTables = response.filter(table => table.estado === true);
                setTables(activeTables);
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
                setLoading(false);
            }
        }
    }, [employeeData]);

    useFocusEffect(
        useCallback(() => {
            fetchTables();
            return () => {};
        }, [fetchTables])
    );

    const handlePressTable = useCallback((table) => {
        setSelectedTable(table);
        setModalVisible(true);
    }, []);

    const closeTable = useCallback(async (table) => {
        try {
            setModalVisible(false);
            setLoading(true);

            // Simulación de cierre de mesa
            const updatedTables = tables.map(t => 
                t.id === table.id ? { ...t, estado: false } : t
            );
            setTables(updatedTables);

            Alert.alert("Éxito", `La mesa ${table.nombre} ha sido cerrada correctamente.`);
        } catch (error) {
            console.error('Error al cerrar la mesa:', error);
            Alert.alert('Error', 'No se pudo cerrar la mesa. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    }, [tables]);

    const handleAddDishes = useCallback(() => {
        if (!selectedTable) return;

        setModalVisible(false);
        console.log("Enviando a CreateAccountScreen con tableId:", selectedTable.id); // <- Verificación
        navigation.navigate('CreateAccountScreen', {
            tableId: selectedTable.id,
            tableName: selectedTable.nombre
        });
    }, [selectedTable, navigation]);

    const handleViewAccount = useCallback(() => {
        if (!selectedTable) return;

        setModalVisible(false);
        console.log("Enviando a AccountScreen con tableId:", selectedTable.id); // <- Verificación
        navigation.navigate('AccountScreen', {
            tableId: selectedTable.id,
            tableName: selectedTable.nombre
        });    
    }, [selectedTable, navigation]);

    const handleCloseTable = useCallback(() => {
        if (!selectedTable) return;

        Alert.alert(
            'Cerrar mesa',
            `¿Estás seguro de que deseas cerrar la mesa ${selectedTable.nombre}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cerrar', onPress: () => closeTable(selectedTable) }
            ]
        );
    }, [selectedTable, closeTable]);

    const renderItem = useCallback(({ item }) => (
        <TouchableOpacity
            style={[styles.tableItem, styles.tableEnabled]}
            onPress={() => handlePressTable(item)}
            disabled={!item.estado}
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
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Header title="Mesas disponibles" />
            <FlatList
                data={tables}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
                numColumns={2}
            />
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Mesa {selectedTable?.nombre}</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={handleAddDishes}>
                            <Text style={styles.modalButtonText}>Agregar platillos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={handleViewAccount}>
                            <Text style={styles.modalButtonText}>Ver cuenta</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={handleCloseTable}>
                            <Text style={styles.modalButtonText}>Cerrar mesa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalCancelText}>Cancelar</Text>
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