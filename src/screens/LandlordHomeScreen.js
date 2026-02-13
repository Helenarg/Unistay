import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

    // Sidebar Navigation Items
    const navItems = [
        { name: 'Overview', icon: 'home-outline' },
        { name: 'My Properties', icon: 'business-outline' },
        { name: 'Booking Requests', icon: 'calendar-outline' },
        { name: 'Earnings', icon: 'cash-outline' },
        { name: 'Settings', icon: 'settings-outline' },
    ];

    useEffect(() => {
        fetchData();
    }, [user]);

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
            // Refresh bookings
            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            ));
            Alert.alert('Success', `Booking ${newStatus}.`);
        } catch (err) {
            console.error('Error updating booking:', err);
            Alert.alert('Error', 'Failed to update booking status.');
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

    const displayName = userProfile?.name || user?.displayName || 'Landlord';
    const pendingBookings = bookings.filter(b => b.status === 'pending');

    // Compute stats from real data
    const stats = [
        { title: 'Active Listings', value: `${listings.length} Properties`, icon: 'home', color: '#eef2ff', iconColor: '#4f46e5' },
        { title: 'Pending Requests', value: `${pendingBookings.length} New`, icon: 'notifications', color: '#fff7ed', iconColor: '#f97316' },
        { title: 'Total Bookings', value: `${bookings.length}`, icon: 'people', color: '#ecfdf5', iconColor: '#10b981' },
        { title: 'Accepted', value: `${bookings.filter(b => b.status === 'accepted').length}`, icon: 'trending-up', color: '#eff6ff', iconColor: '#3b82f6' },
    ];

    return (
        <View style={styles.container}>
            <WebNavbar navigation={navigation} />

            <View style={styles.dashboardContainer}>

                {/* --- LEFT SIDEBAR --- */}
                {isWeb && (
                    <View style={styles.sidebar}>
                        {/* Profile Section */}
                        <View style={styles.profileSection}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    style={styles.avatar}
                                    source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff` }}
                                />
                                <View style={styles.onlineBadge} />
                            </View>
                            <View>
                                <Text style={styles.profileName}>{displayName}</Text>
                                <Text style={styles.profileRole}>Landlord</Text>
                            </View>
                        </View>

                        {/* Navigation Menu */}
                        <View style={styles.navMenu}>
                            {navItems.map((item) => (
                                <TouchableOpacity
                                    key={item.name}
                                    style={[styles.navItem, activeTab === item.name && styles.navItemActive]}
                                    onPress={() => setActiveTab(item.name)}
                                >
                                    <Text style={[styles.navText, activeTab === item.name && styles.navTextActive]}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* CTA Card */}
                        <View style={styles.sidebarCTA}>
                            <Text style={styles.ctaTitle}>List more properties</Text>
                            <TouchableOpacity
                                style={styles.ctaButton}
                                onPress={() => navigation.navigate('CreateListing')}
                            >
                                <Text style={styles.ctaButtonText}>+ Add Property</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Logout */}
                        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                            <Text style={{ color: '#ef4444', fontWeight: '600' }}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* --- MAIN CONTENT AREA --- */}
                <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.pageHeader}>
                        <Text style={styles.pageTitle}>Landlord Dashboard</Text>
                        <TouchableOpacity
                            style={styles.addPropButton}
                            onPress={() => navigation.navigate('CreateListing')}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 5 }}>+ Add New Property</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 40 }} />
                    ) : (
                        <>
                            {/* KPI Cards */}
                            <View style={styles.statsGrid}>
                                {stats.map((stat, index) => (
                                    <View key={index} style={styles.statCard}>
                                        <View style={[styles.iconBox, { backgroundColor: stat.color }]}>
                                            <Text style={{ fontSize: 20 }}>
                                                {stat.icon === 'home' ? '🏠' : stat.icon === 'notifications' ? '🔔' : stat.icon === 'people' ? '👥' : '📈'}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.statLabel}>{stat.title}</Text>
                                            <Text style={styles.statValue}>{stat.value}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            {/* Verification Banner */}
                            <TouchableOpacity
                                style={styles.verificationBanner}
                                onPress={() => navigation.navigate('LandlordVerification')}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                    <View style={styles.checkCircle}>
                                        <Text style={{ fontSize: 18 }}>
                                            {userProfile?.verificationStatus === 'verified' ? '✓' : '⏳'}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={styles.bannerTitle}>
                                            {userProfile?.verificationStatus === 'verified' ? 'Verified Landlord' : 'Verify Your Identity'}
                                        </Text>
                                        <Text style={styles.bannerSubtitle}>
                                            {userProfile?.verificationStatus === 'verified'
                                                ? 'Your account and properties are verified by UniStay'
                                                : 'Complete verification to build trust with students'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.activeBadge, {
                                    backgroundColor: userProfile?.verificationStatus === 'verified' ? '#059669' : '#f59e0b'
                                }]}>
                                    <Text style={styles.activeBadgeText}>
                                        {userProfile?.verificationStatus === 'verified' ? 'Active' : 'Pending'}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/* Sections */}
                            <View style={styles.sectionGrid}>

                                {/* Recent Bookings */}
                                <View style={styles.sectionCard}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle}>Recent Booking Requests</Text>
                                    </View>

                                    {pendingBookings.length === 0 ? (
                                        <Text style={{ color: '#999', textAlign: 'center', padding: 20 }}>No pending booking requests.</Text>
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
                                                        <Text style={{ color: '#fff', fontSize: 13 }}>Accept</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.btnDecline} onPress={() => handleBookingAction(booking.id, 'declined')}>
                                                        <Text style={{ color: '#3b82f6', fontSize: 13 }}>Decline</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))
                                    )}
                                </View>

                                {/* My Properties */}
                                <View style={styles.sectionCard}>
                                    <View style={styles.cardHeader}>
                                        <Text style={styles.cardTitle}>My Properties</Text>
                                    </View>

                                    {listings.length === 0 ? (
                                        <View style={{ alignItems: 'center', padding: 30 }}>
                                            <Text style={{ color: '#999', marginBottom: 15 }}>You haven't listed any properties yet.</Text>
                                            <TouchableOpacity
                                                style={[styles.addPropButton, { alignSelf: 'center' }]}
                                                onPress={() => navigation.navigate('CreateListing')}
                                            >
                                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Create Your First Listing</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        listings.map((listing) => (
                                            <View key={listing.id} style={[styles.bookingItem, styles.borderBottom]}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.bookingName}>{listing.title}</Text>
                                                    <Text style={styles.bookingDetails}>📍 {listing.location}</Text>
                                                    <Text style={styles.bookingDate}>Rs. {listing.price?.toLocaleString()}/month</Text>
                                                </View>
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
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        height: Platform.OS === 'web' ? '100vh' : '100%',
    },
    dashboardContainer: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: 1600,
        width: '100%',
        alignSelf: 'center',
    },

    // Sidebar
    sidebar: {
        width: 250,
        backgroundColor: '#fff',
        borderRightWidth: 1,
        borderColor: '#eee',
        paddingVertical: 30,
        paddingHorizontal: 20,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
    },
    avatarContainer: { position: 'relative', marginRight: 15 },
    avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#ddd' },
    onlineBadge: {
        position: 'absolute', bottom: 0, right: 0,
        width: 12, height: 12, borderRadius: 6, backgroundColor: '#10b981',
        borderWidth: 2, borderColor: '#fff'
    },
    profileName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    profileRole: { fontSize: 13, color: '#64748b' },

    navMenu: { flex: 1 },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 5,
    },
    navItemActive: { backgroundColor: '#3b82f6' },
    navText: { color: '#64748b', fontSize: 15, fontWeight: '500' },
    navTextActive: { color: '#fff', fontWeight: '600' },

    sidebarCTA: {
        backgroundColor: '#0ca678',
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
    },
    ctaTitle: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 15 },
    ctaButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 6,
    },
    ctaButtonText: { color: '#0ca678', fontWeight: 'bold', fontSize: 13 },

    logoutBtn: {
        marginTop: 15,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fee2e2',
        borderRadius: 8,
        backgroundColor: '#fef2f2',
    },

    // Main Content
    mainContent: {
        flex: 1,
        padding: 30,
        backgroundColor: '#f8f9fa',
    },
    pageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
    addPropButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#3b82f6', shadowOpacity: 0.2, shadowRadius: 5,
    },

    // Stats Grid
    statsGrid: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 30,
        flexWrap: 'wrap',
    },
    statCard: {
        flex: 1,
        minWidth: 200,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5,
        borderWidth: 1, borderColor: '#f0f0f0',
    },
    iconBox: {
        width: 48, height: 48, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
    },
    statLabel: { fontSize: 13, color: '#64748b', marginBottom: 4 },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },

    // Verification Banner
    verificationBanner: {
        backgroundColor: '#ecfdf5',
        borderWidth: 1,
        borderColor: '#d1fae5',
        borderRadius: 12,
        padding: 20,
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    checkCircle: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: '#d1fae5'
    },
    bannerTitle: { fontSize: 16, fontWeight: 'bold', color: '#065f46' },
    bannerSubtitle: { fontSize: 14, color: '#047857' },
    activeBadge: {
        paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: 20,
    },
    activeBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

    // Sections
    sectionGrid: { gap: 30, paddingBottom: 50 },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 25,
        borderWidth: 1, borderColor: '#f0f0f0',
        shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },

    bookingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        flexWrap: 'wrap',
        gap: 10,
    },
    borderBottom: { borderBottomWidth: 1, borderColor: '#f1f5f9' },
    bookingName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    bookingDetails: { color: '#64748b', marginVertical: 4 },
    bookingDate: { fontSize: 13, color: '#94a3b8' },

    actionButtons: { flexDirection: 'row', gap: 10 },
    btnAccept: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: 6,
    },
    btnDecline: {
        borderWidth: 1, borderColor: '#3b82f6',
        paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
});
