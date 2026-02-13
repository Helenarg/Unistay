import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';

export default function HostelListCard({ hostel }) {
    return (
        <View style={styles.card}>
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <View style={styles.imagePlaceholder} />
                <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✓ Verified</Text>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{hostel.title}</Text>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>★ {hostel.rating}</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <Text style={styles.locationText}>📍 {hostel.location}</Text>
                    <Text style={styles.distanceText}>• {hostel.distance}</Text>
                </View>

                <View style={styles.reviewsRow}>
                    <View style={styles.genderBadge}>
                        <Text style={styles.genderText}>{hostel.gender}</Text>
                    </View>
                    <Text style={styles.reviewText}>• {hostel.reviews} reviews</Text>
                </View>

                <View style={styles.amenitiesRow}>
                    {hostel.amenities.map((amenity, index) => (
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
                        <Text style={styles.viewDetailsText}>View Details →</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
        // Shadow (subtle)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    imageContainer: {
        height: 200,
        backgroundColor: '#f0f0f0',
        position: 'relative',
    },
    imagePlaceholder: {
        flex: 1,
        backgroundColor: '#ddd', // Placeholder color
    },
    verifiedBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#00c853',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    verifiedText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    contentContainer: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    ratingBadge: {
        backgroundColor: '#e3f2fd', // Light Blue
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    ratingText: {
        color: '#1a73e8', // Google Blue ish
        fontWeight: 'bold',
        fontSize: 14,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationText: {
        color: '#555',
        fontSize: 14,
    },
    distanceText: {
        color: '#1a73e8',
        fontSize: 14,
        marginLeft: 5,
    },
    reviewsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    genderBadge: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 8,
    },
    genderText: {
        color: '#555',
        fontSize: 12,
        fontWeight: '600',
    },
    reviewText: {
        color: '#777',
        fontSize: 13,
    },
    amenitiesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    amenityBadge: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#eee',
    },
    amenityText: {
        color: '#555',
        fontSize: 12,
    },
    moreAmenities: {
        color: '#1a73e8',
        fontSize: 12,
        alignSelf: 'center',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a73e8',
    },
    perMonth: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#555',
    },
    viewDetailsButton: {
        // No background, just text link style based on screenshot
    },
    viewDetailsText: {
        color: '#1a73e8',
        fontWeight: '600',
        fontSize: 14,
    },
});
