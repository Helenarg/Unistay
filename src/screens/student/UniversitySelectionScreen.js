import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/firestoreService';

const UNIVERSITIES = [
    { id: '1', name: 'University of Colombo' },
    { id: '2', name: 'University of Moratuwa' },
    { id: '3', name: 'University of Peradeniya' },
    { id: '4', name: 'University of Kelaniya' },
    { id: '5', name: 'University of Ruhuna' },
    { id: '6', name: 'University of Sri Jayewardenepura' },
];

export default function UniversitySelectionScreen({ navigation }) {
    const { user, refreshProfile } = useAuth();
    const [search, setSearch] = useState('');

    const filteredUniversities = UNIVERSITIES.filter(uni =>
        uni.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = async (uni) => {
        try {
            // Save to Firestore user profile
            if (user) {
                await updateUserProfile(user.uid, { university: uni.name });
                await refreshProfile();
            }
            navigation.navigate('StudentHome', { selectedUniversity: uni.name });
        } catch (err) {
            console.error('Error saving university:', err);
            Alert.alert('Error', 'Failed to save university selection. Please try again.');
            // Navigate anyway with param
            navigation.navigate('StudentHome', { selectedUniversity: uni.name });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.header}>Select Your University</Text>
                <Text style={styles.subHeader}>We'll show you places nearby.</Text>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Search University..."
                    value={search}
                    onChangeText={setSearch}
                />

                <FlatList
                    data={filteredUniversities}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => handleSelect(item)}
                        >
                            <Text style={styles.itemText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No universities found.</Text>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        ...(Platform.OS === 'web' ? { height: '100vh', overflow: 'auto' } : {}),
    },
    content: {
        padding: 20,
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    subHeader: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    searchInput: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
});
