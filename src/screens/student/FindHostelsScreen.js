import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebNavbar from '../../components/WebNavbar';
import WebFooter from '../../components/WebFooter';
import HostelListCard from '../../components/HostelListCard';
import MapComponent from '../../components/MapComponent';
import { getListings } from '../../services/firestoreService';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 900;

export default function FindHostelsScreen({ navigation }) {
    // State for Filters
    const [priceRange, setPriceRange] = useState({ min: 5000, max: 50000 });
    const [maxDistance, setMaxDistance] = useState(5); // km
    const [selectedGender, setSelectedGender] = useState('Any');
    const [selectedUni, setSelectedUni] = useState('University of Colombo');

    // Firestore data
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

    // Fetch listings from Firestore on mount
    useEffect(() => {
        fetchHostels();
    }, []);

    const fetchHostels = async () => {
        setLoadingHostels(true);
        try {
            const listings = await getListings();
            // Transform Firestore data to match component expectations
            const transformed = listings.map((listing, idx) => ({
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
            // Fall back to empty
            setAllHostels([]);
        } finally {
            setLoadingHostels(false);
        }
    };

    // Filtering Logic
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

    return (
        <View style={styles.container}>
            <WebNavbar navigation={navigation} />

            <ScrollView style={{ flex: 1 }}>

                <View style={styles.headerSection}>
                    <Text style={styles.pageTitle}>Student Hostels near {selectedUni}</Text>
                    <Text style={styles.pageSubtitle}>
                        {loadingHostels ? 'Loading...' : `${filteredHostels.length} properties found`}
                    </Text>

                    {/* Visual University Selector */}
                    <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
                        <TouchableOpacity onPress={() => setSelectedUni('University of Colombo')}><Text style={[styles.uniTag, selectedUni === 'University of Colombo' && styles.uniTagActive]}>UoC</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedUni('University of Moratuwa')}><Text style={[styles.uniTag, selectedUni === 'University of Moratuwa' && styles.uniTagActive]}>UoM</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedUni('University of Peradeniya')}><Text style={[styles.uniTag, selectedUni === 'University of Peradeniya' && styles.uniTagActive]}>UoP</Text></TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.hideMapButton}>
                        <Text style={{ color: '#fff' }}>🗺 Hide Map</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.threeColumnLayout}>

                    {/* --- Column 1: Interactive Filters --- */}
                    <View style={styles.filterColumn}>
                        <Text style={styles.filterTitle}>Filters</Text>

                        {/* Budget Filter */}
                        <View style={styles.filterGroup}>
                            <Text style={styles.label}>Budget: Rs. {priceRange.max.toLocaleString()}</Text>
                            <View style={styles.sliderContainer}>
                                <TouchableOpacity
                                    style={styles.sliderTrack}
                                    onPress={() => {
                                        setPriceRange(prev => ({ ...prev, max: prev.max > 25000 ? 15000 : 50000 }))
                                    }}
                                >
                                    <View style={[styles.sliderFill, { width: (priceRange.max / 50000) * 100 + '%' }]} />
                                    <View style={[styles.sliderKnob, { left: (priceRange.max / 50000) * 100 + '%' }]} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.priceLabels}>
                                <Text style={styles.smallText}>Rs. {priceRange.min.toLocaleString()}</Text>
                                <Text style={styles.smallText}>Rs. 50,000</Text>
                            </View>
                        </View>

                        {/* Distance Filter */}
                        <View style={styles.filterGroup}>
                            <Text style={styles.label}>Distance: &lt; {maxDistance} km</Text>
                            <View style={styles.sliderContainer}>
                                <TouchableOpacity
                                    style={styles.sliderTrack}
                                    onPress={() => setMaxDistance(prev => prev === 5 ? 1 : 5)}
                                >
                                    <View style={[styles.sliderFill, { width: (maxDistance / 5) * 100 + '%' }]} />
                                    <View style={[styles.sliderKnob, { left: (maxDistance / 5) * 100 + '%' }]} />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.linkText}>Tap bar to toggle (1km / 5km)</Text>
                        </View>

                        {/* Room Type */}
                        <View style={styles.filterGroup}>
                            <Text style={styles.label}>Room Type</Text>
                            <Checkbox label="Single Room" />
                            <Checkbox label="Shared (2 Person)" />
                            <Checkbox label="Shared (3 Person)" />
                            <Checkbox label="Shared (4 Person)" />
                        </View>

                        {/* Gender */}
                        <View style={styles.filterGroup}>
                            <Text style={styles.label}>Gender Preference</Text>
                            <View style={styles.genderToggle}>
                                {['Any', 'Male', 'Female'].map(g => (
                                    <TouchableOpacity
                                        key={g}
                                        style={[styles.genderBtn, selectedGender === g && styles.genderBtnActive]}
                                        onPress={() => setSelectedGender(g)}
                                    >
                                        <Text style={{ color: selectedGender === g ? '#fff' : '#333' }}>{g}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Facilities */}
                        <View style={styles.filterGroup}>
                            <Text style={styles.label}>Facilities</Text>
                            <Checkbox label="WiFi" />
                            <Checkbox label="Meals Included" />
                            <Checkbox label="AC" />
                        </View>

                        <TouchableOpacity style={styles.resetButton} onPress={() => {
                            setPriceRange({ min: 5000, max: 50000 });
                            setMaxDistance(5);
                            setSelectedGender('Any');
                        }}>
                            <Text style={{ color: '#1a73e8' }}>Reset All</Text>
                        </TouchableOpacity>

                    </View>

                    {/* --- Column 2: Feed --- */}
                    <View style={styles.feedColumn}>
                        {loadingHostels ? (
                            <View style={{ padding: 40, alignItems: 'center' }}>
                                <ActivityIndicator size="large" color="#3b82f6" />
                                <Text style={{ marginTop: 10, color: '#666' }}>Loading hostels...</Text>
                            </View>
                        ) : filteredHostels.length === 0 ? (
                            <View style={{ padding: 40, alignItems: 'center' }}>
                                <Text>No hostels found matching your filters.</Text>
                            </View>
                        ) : (
                            filteredHostels.map(hostel => (
                                <HostelListCard key={hostel.id} hostel={{ ...hostel, price: hostel.priceString }} />
                            ))
                        )}
                    </View>

                    {/* --- Column 3: Interactive Map --- */}
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

// --- Local Helpers ---

function Checkbox({ label }) {
    const [checked, setChecked] = useState(false);
    return (
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }} onPress={() => setChecked(!checked)}>
            <View style={{ width: 18, height: 18, borderWidth: 1, borderColor: checked ? '#3b82f6' : '#ccc', backgroundColor: checked ? '#3b82f6' : 'transparent', borderRadius: 4, marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                {checked && <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>}
            </View>
            <Text style={{ color: '#555' }}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: '100vh',
    },
    mobileContainer: { flex: 1, backgroundColor: '#fff' },

    headerSection: {
        paddingHorizontal: 40,
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        position: 'relative',
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    pageSubtitle: {
        color: '#666',
        marginTop: 5,
    },
    uniTag: {
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: '#eee', color: '#555', fontSize: 12
    },
    uniTagActive: {
        backgroundColor: '#3b82f6', color: '#fff'
    },
    hideMapButton: {
        position: 'absolute',
        right: 40,
        top: 25,
        backgroundColor: '#3b82f6',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
    },

    threeColumnLayout: {
        flexDirection: 'row',
        padding: 20,
        gap: 20,
        maxWidth: 1600,
        alignSelf: 'center',
        width: '100%',
        alignItems: 'flex-start',
    },

    filterColumn: {
        width: '20%',
        minWidth: 250,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    filterGroup: {
        marginBottom: 25,
    },
    label: {
        fontWeight: '600',
        marginBottom: 10,
        color: '#444',
    },
    sliderContainer: {
        height: 20,
        justifyContent: 'center',
    },
    sliderTrack: {
        height: 4,
        backgroundColor: '#ddd',
        borderRadius: 2,
        position: 'relative',
        width: '100%',
    },
    sliderFill: {
        position: 'absolute',
        left: 0,
        height: '100%',
        backgroundColor: '#1a73e8',
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
        borderColor: '#1a73e8',
        shadowColor: 'black', shadowOpacity: 0.1, shadowRadius: 2,
        marginLeft: -8,
    },
    priceLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    smallText: { fontSize: 12, color: '#666' },
    linkText: { color: '#3b82f6', fontSize: 13, marginTop: 5 },

    genderToggle: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 4,
    },
    genderBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 6,
        borderRadius: 6,
    },
    genderBtnActive: {
        backgroundColor: '#3b82f6',
    },

    resetButton: {
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3b82f6',
        borderRadius: 8,
    },

    feedColumn: {
        width: '45%',
    },

    mapColumn: {
        width: '30%',
        height: 600,
        backgroundColor: '#eef6fc',
        borderRadius: 12,
        overflow: 'hidden',
        position: 'sticky',
        top: 20,
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
        width: '100%',
        height: '100%',
    },
});
