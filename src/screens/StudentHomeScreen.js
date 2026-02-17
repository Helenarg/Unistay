import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import WebFooter from '../components/WebFooter';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/authService';
import { getListings } from '../services/firestoreService';

export default function StudentHomeScreen({ navigation, route }) {
    const { user, userProfile, refreshProfile } = useAuth();
    const [university, setUniversity] = useState('Select University');
    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [loadingPlaces, setLoadingPlaces] = useState(false);

    useEffect(() => {
        if (route.params?.selectedUniversity) {
            setUniversity(route.params.selectedUniversity);
        } else if (userProfile?.university) {
            setUniversity(userProfile.university);
        }
    }, [route.params?.selectedUniversity, userProfile?.university]);

    useEffect(() => {
        if (university && university !== 'Select University') fetchNearbyPlaces();
    }, [university]);

    const fetchNearbyPlaces = async () => {
        setLoadingPlaces(true);
        try {
            const listings = await getListings();
            setNearbyPlaces(listings.slice(0, 5));
        } catch (err) {
            console.error('Error fetching nearby places:', err);
        } finally {
            setLoadingPlaces(false);
        }
    };

    const handleLogout = async () => {
        try { await signOut(); navigation.replace('Welcome'); } catch (err) { console.error('Logout error:', err); }
    };

    const verificationStatus = userProfile?.verificationStatus || 'none';
    const displayName = userProfile?.name || user?.displayName || 'Student';

    const getStatusBadge = () => {
        switch (verificationStatus) {
            case 'verified': return { icon: 'shield-checkmark', bg: '#E8F5E9', text: '#27AE60', label: 'Verified' };
            case 'pending': return { icon: 'time', bg: '#FFF8E1', text: '#F39C12', label: 'Pending' };
            default: return { icon: 'alert-circle', bg: '#FEEEEF', text: '#EF475D', label: 'Not Verified' };
        }
    };
    const statusBadge = getStatusBadge();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Top Bar */}
                <View style={styles.topBar}>
                    <View>
                        <Text style={styles.greeting}>Hello, {displayName}! 👋</Text>
                        <Text style={styles.subGreeting}>Find your perfect accommodation</Text>
                    </View>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={18} color="#EF475D" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('FindHostels')}>
                        <View style={[styles.quickIcon, { backgroundColor: '#FEF0F2' }]}>
                            <Ionicons name="search" size={22} color="#EF475D" />
                        </View>
                        <Text style={styles.quickTitle}>Find Hostels</Text>
                        <Text style={styles.quickDesc}>Browse nearby</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('UniversitySelection')}>
                        <View style={[styles.quickIcon, { backgroundColor: '#E8F4FD' }]}>
                            <Ionicons name="school" size={22} color="#3498DB" />
                        </View>
                        <Text style={styles.quickTitle}>University</Text>
                        <Text style={styles.quickDesc}>{university === 'Select University' ? 'Choose one' : university.split(' ').slice(-1)[0]}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('StudentVerification')}>
                        <View style={[styles.quickIcon, { backgroundColor: statusBadge.bg }]}>
                            <Ionicons name={statusBadge.icon} size={22} color={statusBadge.text} />
                        </View>
                        <Text style={styles.quickTitle}>Verification</Text>
                        <Text style={[styles.quickDesc, { color: statusBadge.text }]}>{statusBadge.label}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.quickCard} onPress={() => navigation.navigate('FAQ')}>
                        <View style={[styles.quickIcon, { backgroundColor: '#F3E8FD' }]}>
                            <Ionicons name="help-circle" size={22} color="#8E44AD" />
                        </View>
                        <Text style={styles.quickTitle}>FAQ</Text>
                        <Text style={styles.quickDesc}>Get help</Text>
                    </TouchableOpacity>
                </View>

                {/* University Card */}
                <TouchableOpacity style={styles.uniCard} onPress={() => navigation.navigate('UniversitySelection')}>
                    <View style={styles.uniCardLeft}>
                        <View style={styles.uniCardIcon}>
                            <Ionicons name="school" size={20} color="#EF475D" />
                        </View>
                        <View>
                            <Text style={styles.uniCardLabel}>Your University</Text>
                            <Text style={styles.uniCardValue}>{university}</Text>
                        </View>
                    </View>
                    <View style={styles.uniCardArrow}>
                        <Ionicons name="chevron-forward" size={18} color="#EF475D" />
                    </View>
                </TouchableOpacity>

                {/* Verification Card */}
                <TouchableOpacity style={styles.verifyCard} onPress={() => navigation.navigate('StudentVerification')}>
                    <View style={styles.verifyCardLeft}>
                        <Ionicons name="shield-checkmark-outline" size={20} color="#1A1A1A" />
                        <View style={{ marginLeft: 14 }}>
                            <Text style={styles.verifyTitle}>Identity Verification</Text>
                            <Text style={styles.verifyDesc}>Verify NIC & Student ID to book</Text>
                        </View>
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: statusBadge.bg }]}>
                        <Ionicons name={statusBadge.icon} size={12} color={statusBadge.text} />
                        <Text style={[styles.statusPillText, { color: statusBadge.text }]}>{statusBadge.label}</Text>
                    </View>
                </TouchableOpacity>

                {/* Nearby Places */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Places Near {university}</Text>
                        {university !== 'Select University' && (
                            <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('FindHostels')}>
                                <Text style={styles.viewAllText}>View All</Text>
                                <Ionicons name="arrow-forward" size={12} color="#EF475D" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {university === 'Select University' ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="location-outline" size={40} color="#E8E8E8" />
                            <Text style={styles.emptyTitle}>Select Your University</Text>
                            <Text style={styles.emptyDesc}>Choose your university to see nearby hostels</Text>
                        </View>
                    ) : loadingPlaces ? (
                        <ActivityIndicator size="large" color="#EF475D" style={{ marginTop: 30 }} />
                    ) : nearbyPlaces.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="home-outline" size={40} color="#E8E8E8" />
                            <Text style={styles.emptyTitle}>No Listings Yet</Text>
                            <Text style={styles.emptyDesc}>Check back soon for new properties!</Text>
                        </View>
                    ) : (
                        <View style={styles.placesList}>
                            {nearbyPlaces.map((place, idx) => (
                                <View key={place.id || idx} style={styles.placeCard}>
                                    <View style={styles.placeImagePlaceholder}>
                                        <Ionicons name="image-outline" size={24} color="#ccc" />
                                    </View>
                                    <View style={styles.placeInfo}>
                                        <Text style={styles.placeTitle}>{place.title}</Text>
                                        <View style={styles.placeLocRow}>
                                            <Ionicons name="location-outline" size={13} color="#717171" />
                                            <Text style={styles.placeLoc}>{place.location}</Text>
                                        </View>
                                        <Text style={styles.placePrice}>Rs. {place.price?.toLocaleString()}<Text style={styles.pricePer}>/mo</Text></Text>
                                    </View>
                                    <TouchableOpacity style={styles.placeBtn}>
                                        <Text style={styles.placeBtnText}>View</Text>
                                    </TouchableOpacity>
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
        backgroundColor: '#F7F8FA',
        ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}),
    },
    content: { padding: 20, paddingBottom: 40 },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
    subGreeting: { fontSize: 14, color: '#717171', marginTop: 4 },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FEF0F2',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 25,
    },
    logoutText: { color: '#EF475D', fontWeight: '600', fontSize: 13 },

    // Quick Actions
    quickActions: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    quickCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    quickIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    quickTitle: { fontWeight: '700', fontSize: 13, color: '#1A1A1A', marginBottom: 2 },
    quickDesc: { fontSize: 11, color: '#717171' },

    // University Card
    uniCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderLeftWidth: 4,
        borderLeftColor: '#EF475D',
    },
    uniCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    uniCardIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FEF0F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uniCardLabel: { fontSize: 12, color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    uniCardValue: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginTop: 2 },
    uniCardArrow: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FEF0F2',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Verification Card
    verifyCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    verifyCardLeft: { flexDirection: 'row', alignItems: 'center' },
    verifyTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
    verifyDesc: { fontSize: 12, color: '#717171', marginTop: 2 },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusPillText: { fontSize: 12, fontWeight: '700' },

    // Section
    section: { marginTop: 4 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
    viewAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewAllText: { color: '#EF475D', fontWeight: '600', fontSize: 13 },

    // Empty State
    emptyState: {
        padding: 40,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginTop: 12 },
    emptyDesc: { color: '#717171', textAlign: 'center', marginTop: 4, fontSize: 13 },

    // Place Cards
    placesList: { gap: 12 },
    placeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    placeImagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#F7F8FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    placeInfo: { flex: 1 },
    placeTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
    placeLocRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
    placeLoc: { fontSize: 12, color: '#717171' },
    placePrice: { fontSize: 15, fontWeight: '800', color: '#EF475D' },
    pricePer: { fontSize: 12, fontWeight: '500', color: '#999' },
    placeBtn: {
        backgroundColor: '#EF475D',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    placeBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
});
