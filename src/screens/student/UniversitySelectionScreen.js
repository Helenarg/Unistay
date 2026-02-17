import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/firestoreService';

const UNIVERSITIES = [
    'University of Colombo',
    'University of Moratuwa',
    'University of Peradeniya',
    'University of Kelaniya',
    'University of Ruhuna',
    'University of Sri Jayewardenepura',
];

const UNI_COLORS = ['#1A1A2E', '#2C3E50', '#34495E', '#1A1A2E', '#2C3E50', '#34495E'];

export default function UniversitySelectionScreen({ navigation }) {
    const { user, refreshProfile } = useAuth();
    const [search, setSearch] = useState('');

    const filtered = UNIVERSITIES.filter(u => u.toLowerCase().includes(search.toLowerCase()));

    const handleSelect = async (uni) => {
        try {
            if (user) {
                await updateUserProfile(user.uid, { university: uni });
                await refreshProfile();
            }
            navigation.navigate('StudentHome', { selectedUniversity: uni });
        } catch (err) {
            Alert.alert('Error', 'Failed to update university. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select University</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Choose Your University</Text>
                <Text style={styles.subtitle}>We'll show you accommodation near your campus</Text>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={18} color="#999" style={{ marginRight: 10 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search universities..."
                        placeholderTextColor="#AAA"
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Ionicons name="close-circle" size={18} color="#ccc" />
                        </TouchableOpacity>
                    )}
                </View>

                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item, index }) => {
                        const abbr = item.split(' ').filter(w => w.length > 2).map(w => w[0]).join('').toUpperCase();
                        const color = UNI_COLORS[UNIVERSITIES.indexOf(item)] || '#1A1A2E';
                        return (
                            <TouchableOpacity style={styles.uniCard} onPress={() => handleSelect(item)} activeOpacity={0.7}>
                                <View style={[styles.uniAvatar, { backgroundColor: color }]}>
                                    <Text style={styles.uniAbbr}>{abbr}</Text>
                                </View>
                                <View style={styles.uniInfo}>
                                    <Text style={styles.uniName}>{item}</Text>
                                    <Text style={styles.uniLocation}>Sri Lanka</Text>
                                </View>
                                <View style={styles.uniArrow}>
                                    <Ionicons name="arrow-forward" size={14} color="#EF475D" />
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="school-outline" size={36} color="#E8E8E8" />
                            <Text style={styles.emptyText}>No universities match your search</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F7F8FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: '#717171',
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1A1A1A',
        ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
    },
    uniCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        gap: 14,
    },
    uniAvatar: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uniAbbr: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14,
    },
    uniInfo: { flex: 1 },
    uniName: { fontWeight: '700', fontSize: 15, color: '#1A1A1A' },
    uniLocation: { fontSize: 12, color: '#717171', marginTop: 2 },
    uniArrow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FEF0F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        color: '#999',
        marginTop: 12,
        fontSize: 14,
    },
});
