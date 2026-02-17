import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import WebFooter from '../components/WebFooter';
import WebNavbar from '../components/WebNavbar';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../services/authService';
import { getListingsByLandlord, getBookingsByLandlord, updateBookingStatus } from '../services/firestoreService';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 900;

export default function LandlordHomeScreen({ navigation }) {
    const { user, userProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('Overview');
    const [listings, setListings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const navItems = [
        { name: 'Overview', icon: 'grid-outline' },
        { name: 'My Properties', icon: 'business-outline' },
        { name: 'Booking Requests', icon: 'calendar-outline' },
        { name: 'Earnings', icon: 'wallet-outline' },
        { name: 'Settings', icon: 'settings-outline' },
    ];

    useEffect(() => { fetchData(); }, [user]);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [fetchedListings, fetchedBookings] = await Promise.all([
                getListingsByLandlord(user.uid),
                getBookingsByLandlord(user.uid),
            ]);
            setListings(fetchedListings);
            setBookings(fetchedBookings);
        } catch (err) {
            console.error('Error fetching landlord data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBookingAction = async (bookingId, newStatus) => {
        try {
            await updateBookingStatus(bookingId, newStatus);
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
            Alert.alert('Success', `Booking ${newStatus}.`);
        } catch (err) {
            console.error('Error updating booking:', err);
            Alert.alert('Error', 'Failed to update booking status.');
        }
    };

    const handleLogout = async () => {
        try { await signOut(); navigation.replace('Welcome'); } catch (err) { console.error('Logout error:', err); }
    };

    const displayName = userProfile?.name || user?.displayName || 'Landlord';
    const pendingBookings = bookings.filter(b => b.status === 'pending');

    const stats = [
        { title: 'Active Listings', value: `${listings.length}`, icon: 'business', bg: '#FEF0F2', color: '#EF475D' },
        { title: 'Pending Requests', value: `${pendingBookings.length}`, icon: 'notifications', bg: '#FFF8E1', color: '#F39C12' },
        { title: 'Total Bookings', value: `${bookings.length}`, icon: 'people', bg: '#E8F5E9', color: '#27AE60' },
        { title: 'Accepted', value: `${bookings.filter(b => b.status === 'accepted').length}`, icon: 'trending-up', bg: '#E8F4FD', color: '#3498DB' },
    ];

    return (
        <View style={styles.container}>
            <WebNavbar navigation={navigation} />

            <View style={styles.dashboardContainer}>
                {/* Sidebar */}
                {isWeb && (
                    <View style={styles.sidebar}>
                        <View style={styles.profileSection}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    style={styles.avatar}
                                    source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=EF475D&color=fff` }}
                                />
                                <View style={styles.onlineBadge} />
                            </View>
                            <View>
                                <Text style={styles.profileName}>{displayName}</Text>
                                <Text style={styles.profileRole}>Landlord</Text>
                            </View>
                        </View>

                        <View style={styles.navMenu}>
                            {navItems.map((item) => (
                                <TouchableOpacity
                                    key={item.name}
                                    style={[styles.navItem, activeTab === item.name && styles.navItemActive]}
                                    onPress={() => setActiveTab(item.name)}
                                >
                                    <Ionicons name={item.icon} size={18} color={activeTab === item.name ? '#EF475D' : '#999'} style={{ marginRight: 12 }} />
                                    <Text style={[styles.navText, activeTab === item.name && styles.navTextActive]}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.sidebarCTA}>
                            <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginBottom: 8 }} />
                            <Text style={styles.ctaTitle}>List more properties</Text>
                            <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('CreateListing')}>
                                <Text style={styles.ctaButtonText}>+ Add Property</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={16} color="#EF475D" style={{ marginRight: 8 }} />
                            <Text style={styles.logoutBtnText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Main Content */}
                <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.pageHeader}>
                        <View>
                            <Text style={styles.greeting}>Welcome back, {displayName}! 👋</Text>
                            <Text style={styles.pageSubtitle}>Manage your properties and bookings</Text>
                        </View>
                        <TouchableOpacity style={styles.addPropButton} onPress={() => navigation.navigate('CreateListing')}>
                            <Ionicons name="add" size={18} color="#fff" style={{ marginRight: 6 }} />
                            <Text style={styles.addPropText}>Add New Property</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="#EF475D" style={{ marginTop: 40 }} />
                    ) : (
                        <>
                            {/* Stats */}
                            <View style={styles.statsGrid}>
                                {stats.map((stat, index) => (
                                    <View key={index} style={styles.statCard}>
                                        <View style={[styles.iconBox, { backgroundColor: stat.bg }]}>
                                            <Ionicons name={stat.icon} size={22} color={stat.color} />
                                        </View>
                                        <View>
                                            <Text style={styles.statLabel}>{stat.title}</Text>
                                            <Text style={styles.statValue}>{stat.value}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            {/* Verification Banner */}
                            <TouchableOpacity style={styles.verificationBanner} onPress={() => navigation.navigate('LandlordVerification')}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                    <View style={[styles.checkCircle, {
                                        backgroundColor: userProfile?.verificationStatus === 'verified' ? '#E8F5E9' : '#FEF0F2'
                                    }]}>
                                        <Ionicons
                                            name={userProfile?.verificationStatus === 'verified' ? 'shield-checkmark' : 'time'}
                                            size={20}
                                            color={userProfile?.verificationStatus === 'verified' ? '#27AE60' : '#EF475D'}
                                        />
                                    </View>
                                    <View>
                                        <Text style={styles.bannerTitle}>
                                            {userProfile?.verificationStatus === 'verified' ? 'Verified Landlord' : 'Verify Your Identity'}
                                        </Text>
                                        <Text style={styles.bannerSubtitle}>
                                            {userProfile?.verificationStatus === 'verified'
                                                ? 'Your account and properties are verified'
                                                : 'Complete verification to build trust with students'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.statusPill, {
                                    backgroundColor: userProfile?.verificationStatus === 'verified' ? '#E8F5E9' : '#FFF8E1'
                                }]}>
                                    <Text style={[styles.statusPillText, {
                                        color: userProfile?.verificationStatus === 'verified' ? '#27AE60' : '#F39C12'
                                    }]}>
                                        {userProfile?.verificationStatus === 'verified' ? 'Active' : 'Pending'}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/* Sections */}
                            <View style={styles.sectionGrid}>
                                {/* Recent Bookings */}
                                <View style={styles.sectionCard}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.cardTitleRow}>
                                            <Ionicons name="calendar-outline" size={18} color="#1A1A1A" />
                                            <Text style={styles.cardTitle}>Recent Booking Requests</Text>
                                        </View>
                                    </View>
                                    {pendingBookings.length === 0 ? (
                                        <View style={styles.emptyState}>
                                            <Ionicons name="calendar-outline" size={32} color="#E8E8E8" />
                                            <Text style={styles.emptyText}>No pending booking requests</Text>
                                        </View>
                                    ) : (
                                        pendingBookings.map((booking, idx) => (
                                            <View key={booking.id} style={[styles.bookingItem, idx !== pendingBookings.length - 1 && styles.borderBottom]}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.bookingName}>{booking.studentName || 'Student'}</Text>
                                                    <Text style={styles.bookingDetails}>{booking.listingTitle} • {booking.roomType}</Text>
                                                    <Text style={styles.bookingDate}>Move-in: {booking.moveInDate || 'TBD'}</Text>
                                                </View>
                                                <View style={styles.actionButtons}>
                                                    <TouchableOpacity style={styles.btnAccept} onPress={() => handleBookingAction(booking.id, 'accepted')}>
                                                        <Text style={styles.btnAcceptText}>Accept</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.btnDecline} onPress={() => handleBookingAction(booking.id, 'declined')}>
                                                        <Text style={styles.btnDeclineText}>Decline</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))
                                    )}
                                </View>

                                {/* My Properties */}
                                <View style={styles.sectionCard}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.cardTitleRow}>
                                            <Ionicons name="business-outline" size={18} color="#1A1A1A" />
                                            <Text style={styles.cardTitle}>My Properties</Text>
                                        </View>
                                    </View>
                                    {listings.length === 0 ? (
                                        <View style={styles.emptyState}>
                                            <Ionicons name="home-outline" size={32} color="#E8E8E8" />
                                            <Text style={styles.emptyText}>No properties listed yet</Text>
                                            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('CreateListing')}>
                                                <Text style={styles.emptyBtnText}>+ Create Your First Listing</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        listings.map((listing) => (
                                            <View key={listing.id} style={[styles.bookingItem, styles.borderBottom]}>
                                                <View style={styles.listingIconBox}>
                                                    <Ionicons name="business" size={18} color="#EF475D" />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.bookingName}>{listing.title}</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                                        <Ionicons name="location-outline" size={13} color="#717171" />
                                                        <Text style={styles.bookingDetails}>{listing.location}</Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.listingPrice}>Rs. {listing.price?.toLocaleString()}<Text style={styles.pricePer}>/mo</Text></Text>
                                            </View>
                                        ))
                                    )}
                                </View>
                            </View>
                        </>
                    )}

                    <WebFooter />
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FA', ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}) },
    dashboardContainer: { flex: 1, flexDirection: 'row', maxWidth: 1600, width: '100%', alignSelf: 'center' },

    // Sidebar
    sidebar: {
        width: 260,
        backgroundColor: '#fff',
        borderRightWidth: 1,
        borderColor: '#F0F0F0',
        paddingVertical: 28,
        paddingHorizontal: 20,
        flexDirection: 'column',
        height: '100%',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#F0F0F0',
    },
    avatarContainer: { position: 'relative', marginRight: 14 },
    avatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#ddd' },
    onlineBadge: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#27AE60', borderWidth: 2, borderColor: '#fff' },
    profileName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
    profileRole: { fontSize: 13, color: '#717171', marginTop: 2 },

    navMenu: { flex: 1 },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        marginBottom: 4,
    },
    navItemActive: { backgroundColor: '#FEF0F2' },
    navText: { color: '#999', fontSize: 14, fontWeight: '500' },
    navTextActive: { color: '#EF475D', fontWeight: '700' },

    sidebarCTA: {
        backgroundColor: '#EF475D',
        padding: 20,
        borderRadius: 16,
        marginTop: 20,
    },
    ctaTitle: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 12 },
    ctaButton: { backgroundColor: '#fff', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    ctaButtonText: { color: '#EF475D', fontWeight: '700', fontSize: 13 },

    logoutBtn: {
        marginTop: 14,
        paddingVertical: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FEEEEF',
        borderRadius: 12,
        backgroundColor: '#FAFAFA',
    },
    logoutBtnText: { color: '#EF475D', fontWeight: '600', fontSize: 14 },

    // Main
    mainContent: { flex: 1, padding: 28, backgroundColor: '#F7F8FA' },
    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 28,
    },
    greeting: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
    pageSubtitle: { fontSize: 14, color: '#717171', marginTop: 4 },
    addPropButton: {
        backgroundColor: '#EF475D',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addPropText: { color: '#fff', fontWeight: '700', fontSize: 14 },

    // Stats
    statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 24, flexWrap: 'wrap' },
    statCard: {
        flex: 1,
        minWidth: 200,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    statLabel: { fontSize: 12, color: '#999', marginBottom: 4, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },
    statValue: { fontSize: 22, fontWeight: '800', color: '#1A1A1A' },

    // Verification
    verificationBanner: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    checkCircle: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    bannerTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
    bannerSubtitle: { fontSize: 13, color: '#717171', marginTop: 2 },
    statusPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
    statusPillText: { fontWeight: '700', fontSize: 12 },

    // Sections
    sectionGrid: { gap: 24, paddingBottom: 40 },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    cardHeader: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F7F8FA' },
    cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },

    emptyState: { alignItems: 'center', padding: 30 },
    emptyText: { color: '#999', marginTop: 10, fontSize: 14 },
    emptyBtn: { backgroundColor: '#EF475D', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, marginTop: 14 },
    emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

    bookingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        flexWrap: 'wrap',
        gap: 10,
    },
    borderBottom: { borderBottomWidth: 1, borderColor: '#F7F8FA' },
    bookingName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
    bookingDetails: { color: '#717171', fontSize: 13 },
    bookingDate: { fontSize: 12, color: '#999', marginTop: 2 },
    listingIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#FEF0F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    listingPrice: { fontSize: 16, fontWeight: '800', color: '#EF475D' },
    pricePer: { fontSize: 12, fontWeight: '500', color: '#999' },

    actionButtons: { flexDirection: 'row', gap: 8 },
    btnAccept: { backgroundColor: '#EF475D', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
    btnAcceptText: { color: '#fff', fontSize: 13, fontWeight: '600' },
    btnDecline: { borderWidth: 1.5, borderColor: '#EF475D', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#fff' },
    btnDeclineText: { color: '#EF475D', fontSize: 13, fontWeight: '600' },
});
