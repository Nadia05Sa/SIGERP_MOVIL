import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, FlatList, Image, Modal, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { doGet } from '../axiosConfig/axiosInterceptor';

const TablesScreen = () => {
    const [mesaState, setMesaState] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const data = await doGet('/mesas'); // GET para obtener las mesas
                console.log("Mesas recibidas:", data);

                // Obtener imágenes para cada mesa
                const mesasWithImages = await Promise.all(
                    data.map(async (mesa) => {
                        try {
                            const imageResponse = await doGet(`/mesas/image/${mesa.id}`); // GET de imagen
                            return { ...mesa, imagen: imageResponse?.url || null }; // Asocia la URL de la imagen
                        } catch (error) {
                            console.error(`Error obteniendo imagen para la mesa ${mesa.id}:`, error);
                            return { ...mesa, imagen: null }; // Asigna null si falla el GET
                        }
                    })
                );

                setMesaState(mesasWithImages);
            } catch (error) {
                console.error('Error fetching tables:', error);
                Alert.alert('Error', 'No se pudieron cargar las mesas.');
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, []);

    const enableTable = async (mesa) => {
        try {
            await doPatch(`/mesas/${mesa.id}/estado`, { estado: true });
            setMesaState((prevState) =>
                prevState.map((m) => (m.id === mesa.id ? { ...m, estado: true } : m))
            );
        } catch (error) {
            console.error('Error enabling table:', error);
            Alert.alert('Error', 'No se pudo habilitar la mesa. Intenta más tarde.');
        }
    };

    const handlePressTable = useCallback((mesa) => {
        if (mesa.estado) {
            setSelectedTable(mesa);
            setModalVisible(true);
            return;
        }

        Alert.alert(
            'Habilitar Mesa',
            '¿Quieres habilitar esta mesa?',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Sí', onPress: () => enableTable(mesa) },
            ]
        );
    }, []);

    const handleAddDishes = () => {
        setModalVisible(false);
        navigation.navigate('CreateAccountScreen');
    };

    const handleViewAccount = () => {
        setModalVisible(false);
        Alert.alert('Ver cuenta', `Mostrando cuenta para la mesa: ${selectedTable.nombre}`);
    };

    const renderItem = useCallback(({ item }) => (
        <TouchableOpacity
            style={[styles.tableItem, item.estado && styles.tableEnabled]}
            onPress={() => handlePressTable(item)}
        >
           <Image
    source={
        item.imagen
            ? { uri: item.imagen } // URL válida para la imagen
            : require('../../assets/mesa-de-comedor.png') // Imagen por defecto con ruta ajustada
    }
    style={[styles.icon, item.estado && { tintColor: '#9B1C31' }]}
/>

            <Text style={[styles.tableText, item.estado && { color: '#9B1C31' }]}>{item.nombre}</Text>
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
            <StatusBar barStyle={modalVisible ? 'dark-content' : 'light-content'} backgroundColor={modalVisible ? 'rgba(0,0,0,0.5)' : '#fff'} />
            <Header title="Tus mesas" />
            <FlatList
                data={mesaState}
                renderItem={renderItem}
                keyExtractor={(item) => `mesa-${item.id}`}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
            />
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Opciones para {selectedTable?.nombre}</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={handleAddDishes}>
                            <Text style={styles.modalButtonText}>Agregar platillos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={handleViewAccount}>
                            <Text style={styles.modalButtonText}>Ver cuenta</Text>
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