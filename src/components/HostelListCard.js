import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HostelListCard({ hostel }) {
    return (
        <View style={styles.card}>
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={32} color="#ccc" />
                </View>
                <View style={styles.verifiedBadge}>
                    <Ionicons name="shield-checkmark" size={12} color="#fff" style={{ marginRight: 4 }} />
                    <Text style={styles.verifiedText}>Verified</Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{hostel.title}</Text>
                    <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={12} color="#F39C12" style={{ marginRight: 3 }} />
                        <Text style={styles.ratingText}>{hostel.rating}</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color="#717171" />
                    <Text style={styles.locationText}>{hostel.location}</Text>
                    <Text style={styles.distanceText}>• {hostel.distance} km</Text>
                </View>

                <View style={styles.reviewsRow}>
                    <View style={styles.genderBadge}>
                        <Ionicons name={hostel.gender === 'Female' ? 'female' : hostel.gender === 'Male' ? 'male' : 'people'} size={12} color="#717171" style={{ marginRight: 4 }} />
                        <Text style={styles.genderText}>{hostel.gender}</Text>
                    </View>
                    <Text style={styles.reviewText}>{hostel.reviews} reviews</Text>
                </View>

                <View style={styles.amenitiesRow}>
                    {hostel.amenities?.slice(0, 3).map((amenity, index) => (
                        <View key={index} style={styles.amenityBadge}>
                            <Text style={styles.amenityText}>{amenity}</Text>
                        </View>
                    ))}
                    {hostel.moreAmenities > 0 && (
                        <Text style={styles.moreAmenities}>+{hostel.moreAmenities} more</Text>
                    )}
                </View>

                <View style={styles.footerRow}>
                    <Text style={styles.priceText}>
                        {hostel.price} <Text style={styles.perMonth}>/ month</Text>
                    </Text>
                    <TouchableOpacity style={styles.viewDetailsButton}>
                        <Text style={styles.viewDetailsText}>View Details</Text>
                        <Ionicons name="arrow-forward" size={14} color="#EF475D" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    imageContainer: {
        height: 180,
        backgroundColor: '#F7F8FA',
        position: 'relative',
    },
    imagePlaceholder: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifiedBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#27AE60',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    verifiedText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    contentContainer: {
        padding: 18,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        marginRight: 10,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingText: {
        color: '#F39C12',
        fontWeight: '800',
        fontSize: 13,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 4,
    },
    locationText: {
        color: '#717171',
        fontSize: 13,
    },
    distanceText: {
        color: '#EF475D',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 4,
    },
    reviewsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    genderBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    genderText: {
        color: '#717171',
        fontSize: 12,
        fontWeight: '600',
    },
    reviewText: {
        color: '#999',
        fontSize: 12,
    },
    amenitiesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 16,
    },
    amenityBadge: {
        backgroundColor: '#F7F8FA',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    amenityText: {
        color: '#717171',
        fontSize: 12,
        fontWeight: '500',
    },
    moreAmenities: {
        color: '#EF475D',
        fontSize: 12,
        fontWeight: '600',
        alignSelf: 'center',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: '#F7F8FA',
    },
    priceText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#EF475D',
    },
    perMonth: {
        fontSize: 13,
        fontWeight: '500',
        color: '#999',
    },
    viewDetailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FEF0F2',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    viewDetailsText: {
        color: '#EF475D',
        fontWeight: '700',
        fontSize: 13,
    },
});
