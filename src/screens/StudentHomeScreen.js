import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebFooter from '../components/WebFooter';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/authService';
import { getListings } from '../services/firestoreService';

export default function StudentHomeScreen({ navigation, route }) {
    const { user, userProfile, refreshProfile } = useAuth();
    const [university, setUniversity] = useState('Select University');
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [loadingPlaces, setLoadingPlaces] = useState(false);

    // Sync university from profile or route params
    useEffect(() => {
        if (route.params?.selectedUniversity) {
            setUniversity(route.params.selectedUniversity);
        } else if (userProfile?.university) {
            setUniversity(userProfile.university);
        }
    }, [route.params?.selectedUniversity, userProfile?.university]);

    // Fetch nearby listings when university changes
    useEffect(() => {
        if (university && university !== 'Select University') {
            fetchNearbyPlaces();
        }
    }, [university]);

    const fetchNearbyPlaces = async () => {
        setLoadingPlaces(true);
        try {
            const listings = await getListings();
            // Show up to 5 listings as "nearby" (in production, filter by proximity)
            setNearbyPlaces(listings.slice(0, 5));
        } catch (err) {
            console.error('Error fetching nearby places:', err);
        } finally {
            setLoadingPlaces(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigation.replace('Welcome');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const verificationStatus = userProfile?.verificationStatus || 'none';
    const displayName = userProfile?.name || user?.displayName || 'Student';

    const getStatusBadgeStyle = () => {
        switch (verificationStatus) {
            case 'verified': return { bg: '#d4edda', text: '#155724', label: 'Verified' };
            case 'pending': return { bg: '#fff3cd', text: '#856404', label: 'Pending' };
            default: return { bg: '#f8d7da', text: '#721c24', label: 'Not Verified' };
        }
    };

    const statusBadge = getStatusBadgeStyle();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hello, {displayName}!</Text>
                    <TouchableOpacity onPress={handleLogout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* Action Card: University Selection */}
                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('UniversitySelection')}
                >
                    <View>
                        <Text style={styles.cardTitle}>University</Text>
                        <Text style={styles.cardSubtitle}>{university}</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>

                {/* Action Card: Verification */}
                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('StudentVerification')}
                >
                    <View>
                        <Text style={styles.cardTitle}>Identity Verification</Text>
                        <Text style={styles.cardSubtitle}>Verify NIC & Student ID to book.</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
                        <Text style={[styles.statusText, { color: statusBadge.text }]}>{statusBadge.label}</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Places Near {university}</Text>

                    {university === 'Select University' ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>Select your university above to see recommendations.</Text>
                        </View>
                    ) : loadingPlaces ? (
                        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
                    ) : nearbyPlaces.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No listings found yet. Check back soon!</Text>
                        </View>
                    ) : (
                        <View style={styles.placeholderList}>
                            {nearbyPlaces.map((place, idx) => (
                                <View key={place.id || idx} style={styles.placeholderItem}>
                                    <Text style={styles.placeTitle}>{place.title}</Text>
                                    <Text style={styles.placeDetail}>📍 {place.location} • Rs. {place.price?.toLocaleString()}/mo</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

            </ScrollView>
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    logoutText: {
        color: '#ff4444',
        fontSize: 16,
    },
    actionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    chevron: {
        fontSize: 24,
        color: '#ccc',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    emptyState: {
        padding: 30,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    emptyStateText: {
        color: '#999',
        textAlign: 'center',
    },
    placeholderList: {
        gap: 15,
    },
    placeholderItem: {
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    placeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    placeDetail: {
        fontSize: 14,
        color: '#666',
    },
});
