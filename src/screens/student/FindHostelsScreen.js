import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import WebNavbar from '../../components/WebNavbar';
import WebFooter from '../../components/WebFooter';
import HostelListCard from '../../components/HostelListCard';
import MapComponent from '../../components/MapComponent';
import { getListings } from '../../services/firestoreService';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 900;

export default function FindHostelsScreen({ navigation }) {
    const [priceRange, setPriceRange] = useState({ min: 5000, max: 50000 });
    const [maxDistance, setMaxDistance] = useState(5);
    const [selectedGender, setSelectedGender] = useState('Any');
    const [selectedUni, setSelectedUni] = useState('University of Colombo');
    const [allHostels, setAllHostels] = useState([]);
    const [loadingHostels, setLoadingHostels] = useState(true);

    const UNI_COORDINATES = {
        'University of Colombo': [6.9000, 79.8588],
        'University of Moratuwa': [6.7951, 79.9009],
        'University of Peradeniya': [7.2549, 80.5974],
        'University of Kelaniya': [6.9733, 79.9157],
        'University of Ruhuna': [5.9383, 80.5756],
        'University of Sri Jayewardenepura': [6.8528, 79.9036]
    };

    useEffect(() => { fetchHostels(); }, []);

    const fetchHostels = async () => {
        setLoadingHostels(true);
        try {
            const listings = await getListings();
            const transformed = listings.map((listing) => ({
                id: listing.id,
                title: listing.title,
                location: listing.location,
                distance: listing.distance || 1.0,
                distanceData: listing.distance || 1.0,
                rating: listing.rating || 0,
                reviews: listing.reviews || 0,
                gender: listing.gender || 'Any',
                amenities: listing.amenities || [],
                moreAmenities: Math.max(0, (listing.amenities?.length || 0) - 3),
                price: listing.price,
                priceString: `Rs. ${listing.price?.toLocaleString() || '0'}`,
                position: listing.position || UNI_COORDINATES['University of Colombo'],
            }));
            setAllHostels(transformed);
        } catch (err) {
            console.error('Error fetching hostels:', err);
            setAllHostels([]);
        } finally {
            setLoadingHostels(false);
        }
    };

    const filteredHostels = useMemo(() => {
        return allHostels.filter(h => {
            if (h.price < priceRange.min || h.price > priceRange.max) return false;
            if (h.distanceData > maxDistance) return false;
            if (selectedGender !== 'Any' && h.gender !== selectedGender && h.gender !== 'Any') return false;
            return true;
        });
    }, [allHostels, priceRange, maxDistance, selectedGender]);

    if (!isWeb) {
        return (
            <SafeAreaView style={styles.mobileContainer}>
                <Text style={{ padding: 20 }}>Mobile View Coming Soon</Text>
            </SafeAreaView>
        );
    }

    const uniTags = [
        { key: 'University of Colombo', label: 'UoC' },
        { key: 'University of Moratuwa', label: 'UoM' },
        { key: 'University of Peradeniya', label: 'UoP' },
        { key: 'University of Kelaniya', label: 'UoK' },
        { key: 'University of Ruhuna', label: 'UoR' },
        { key: 'University of Sri Jayewardenepura', label: 'USJ' },
    ];

    return (
        <View style={styles.container}>
            <WebNavbar navigation={navigation} />

            <ScrollView style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.headerSection}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.pageTitle}>Student Hostels near {selectedUni}</Text>
                        <Text style={styles.pageSubtitle}>
                            {loadingHostels ? 'Loading...' : `${filteredHostels.length} properties found`}
                        </Text>
                        <View style={styles.uniTagsRow}>
                            {uniTags.map(u => (
                                <TouchableOpacity key={u.key} style={[styles.uniTag, selectedUni === u.key && styles.uniTagActive]} onPress={() => setSelectedUni(u.key)}>
                                    <Text style={[styles.uniTagText, selectedUni === u.key && styles.uniTagTextActive]}>{u.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <TouchableOpacity style={styles.mapToggleBtn}>
                        <Ionicons name="map-outline" size={16} color="#fff" />
                        <Text style={styles.mapToggleText}>Hide Map</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.threeColumnLayout}>
                    {/* Filters */}
                    <View style={styles.filterColumn}>
                        <View style={styles.filterHeader}>
                            <Ionicons name="options-outline" size={18} color="#1A1A1A" />
                            <Text style={styles.filterTitle}>Filters</Text>
                        </View>

                        {/* Budget */}
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Budget</Text>
                            <Text style={styles.filterValue}>Rs. {priceRange.max.toLocaleString()}</Text>
                            <View style={styles.sliderContainer}>
                                <TouchableOpacity style={styles.sliderTrack} onPress={() => setPriceRange(prev => ({ ...prev, max: prev.max > 25000 ? 15000 : 50000 }))}>
                                    <View style={[styles.sliderFill, { width: (priceRange.max / 50000) * 100 + '%' }]} />
                                    <View style={[styles.sliderKnob, { left: (priceRange.max / 50000) * 100 + '%' }]} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.priceLabels}>
                                <Text style={styles.smallText}>Rs. {priceRange.min.toLocaleString()}</Text>
                                <Text style={styles.smallText}>Rs. 50,000</Text>
                            </View>
                        </View>

                        {/* Distance */}
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Distance</Text>
                            <Text style={styles.filterValue}>&lt; {maxDistance} km</Text>
                            <View style={styles.sliderContainer}>
                                <TouchableOpacity style={styles.sliderTrack} onPress={() => setMaxDistance(prev => prev === 5 ? 1 : 5)}>
                                    <View style={[styles.sliderFill, { width: (maxDistance / 5) * 100 + '%' }]} />
                                    <View style={[styles.sliderKnob, { left: (maxDistance / 5) * 100 + '%' }]} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.hintText}>Tap to toggle (1km / 5km)</Text>
                        </View>

                        {/* Room Type */}
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Room Type</Text>
                            <Checkbox label="Single Room" />
                            <Checkbox label="Shared (2 Person)" />
                            <Checkbox label="Shared (3 Person)" />
                            <Checkbox label="Shared (4 Person)" />
                        </View>

                        {/* Gender */}
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Gender</Text>
                            <View style={styles.genderToggle}>
                                {['Any', 'Male', 'Female'].map(g => (
                                    <TouchableOpacity key={g} style={[styles.genderBtn, selectedGender === g && styles.genderBtnActive]} onPress={() => setSelectedGender(g)}>
                                        <Text style={[styles.genderBtnText, selectedGender === g && styles.genderBtnTextActive]}>{g}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Facilities */}
                        <View style={styles.filterGroup}>
                            <Text style={styles.filterLabel}>Facilities</Text>
                            <Checkbox label="WiFi" />
                            <Checkbox label="Meals Included" />
                            <Checkbox label="AC" />
                        </View>

                        <TouchableOpacity style={styles.resetButton} onPress={() => {
                            setPriceRange({ min: 5000, max: 50000 });
                            setMaxDistance(5);
                            setSelectedGender('Any');
                        }}>
                            <Ionicons name="refresh-outline" size={14} color="#EF475D" />
                            <Text style={styles.resetText}>Reset All</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Feed */}
                    <View style={styles.feedColumn}>
                        {loadingHostels ? (
                            <View style={styles.loadingState}>
                                <ActivityIndicator size="large" color="#EF475D" />
                                <Text style={styles.loadingText}>Loading hostels...</Text>
                            </View>
                        ) : filteredHostels.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="home-outline" size={40} color="#E8E8E8" />
                                <Text style={styles.emptyTitle}>No Properties Found</Text>
                                <Text style={styles.emptyDesc}>Try adjusting your filters</Text>
                            </View>
                        ) : (
                            filteredHostels.map(hostel => (
                                <HostelListCard key={hostel.id} hostel={{ ...hostel, price: hostel.priceString }} />
                            ))
                        )}
                    </View>

                    {/* Map */}
                    <View style={styles.mapColumn}>
                        <View style={styles.mapContainer}>
                            <MapComponent
                                center={UNI_COORDINATES[selectedUni] || UNI_COORDINATES['University of Colombo']}
                                zoom={13}
                                markers={[
                                    {
                                        position: UNI_COORDINATES[selectedUni] || UNI_COORDINATES['University of Colombo'],
                                        title: selectedUni,
                                        description: 'Selected University'
                                    },
                                    ...filteredHostels.map(h => ({
                                        position: h.position,
                                        title: h.title,
                                        description: `${h.priceString} - ${h.location}`
                                    }))
                                ]}
                            />
                        </View>
                    </View>
                </View>

                <WebFooter />
            </ScrollView>
        </View>
    );
}

function Checkbox({ label }) {
    const [checked, setChecked] = useState(false);
    return (
        <TouchableOpacity style={styles.checkboxRow} onPress={() => setChecked(!checked)}>
            <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked && <Ionicons name="checkmark" size={12} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FA', ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}) },
    mobileContainer: { flex: 1, backgroundColor: '#F7F8FA' },

    headerSection: {
        paddingHorizontal: 40,
        paddingVertical: 24,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerLeft: { flex: 1 },
    pageTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
    pageSubtitle: { color: '#717171', marginTop: 4, fontSize: 14 },
    uniTagsRow: { flexDirection: 'row', marginTop: 14, gap: 8 },
    uniTag: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#F7F8FA',
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    uniTagActive: { backgroundColor: '#EF475D', borderColor: '#EF475D' },
    uniTagText: { fontSize: 13, color: '#717171', fontWeight: '600' },
    uniTagTextActive: { color: '#fff' },
    mapToggleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#EF475D',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    mapToggleText: { color: '#fff', fontWeight: '600', fontSize: 13 },

    threeColumnLayout: {
        flexDirection: 'row',
        padding: 24,
        gap: 20,
        maxWidth: 1600,
        alignSelf: 'center',
        width: '100%',
        alignItems: 'flex-start',
    },

    // Filters
    filterColumn: {
        width: '20%',
        minWidth: 250,
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
    filterGroup: { marginBottom: 24 },
    filterLabel: { fontWeight: '700', marginBottom: 6, color: '#1A1A1A', fontSize: 14 },
    filterValue: { color: '#EF475D', fontWeight: '700', fontSize: 13, marginBottom: 8 },
    sliderContainer: { height: 20, justifyContent: 'center' },
    sliderTrack: {
        height: 4,
        backgroundColor: '#F0F0F0',
        borderRadius: 2,
        position: 'relative',
        width: '100%',
    },
    sliderFill: {
        position: 'absolute',
        left: 0,
        height: '100%',
        backgroundColor: '#EF475D',
        borderRadius: 2,
    },
    sliderKnob: {
        position: 'absolute',
        top: -6,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#EF475D',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginLeft: -8,
    },
    priceLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
    smallText: { fontSize: 11, color: '#999' },
    hintText: { color: '#EF475D', fontSize: 12, marginTop: 6, fontWeight: '500' },

    genderToggle: {
        flexDirection: 'row',
        backgroundColor: '#F7F8FA',
        borderRadius: 10,
        padding: 3,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    genderBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 8,
    },
    genderBtnActive: { backgroundColor: '#EF475D' },
    genderBtnText: { color: '#717171', fontWeight: '600', fontSize: 13 },
    genderBtnTextActive: { color: '#fff' },

    checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: '#E8E8E8',
        borderRadius: 6,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
    },
    checkboxChecked: { backgroundColor: '#EF475D', borderColor: '#EF475D' },
    checkboxLabel: { color: '#555', fontSize: 14 },

    resetButton: {
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#EF475D',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    resetText: { color: '#EF475D', fontWeight: '600', fontSize: 14 },

    // Feed
    feedColumn: { width: '45%' },
    loadingState: { padding: 40, alignItems: 'center' },
    loadingText: { marginTop: 12, color: '#717171', fontSize: 14 },
    emptyState: {
        padding: 50,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginTop: 12 },
    emptyDesc: { color: '#717171', marginTop: 4, fontSize: 13 },

    // Map
    mapColumn: {
        width: '30%',
        height: 600,
        backgroundColor: '#F7F8FA',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'sticky',
        top: 20,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
        width: '100%',
        height: '100%',
    },
});
