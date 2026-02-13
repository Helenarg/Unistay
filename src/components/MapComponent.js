import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MapComponent({ center, zoom, markers, style }) {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.placeholder}>
                <Ionicons name="map" size={48} color="#cbd5e1" />
                <Text style={styles.text}>Interactive Map is optimized for Web</Text>
                <Text style={styles.subText}>View on desktop to explore the university surroundings.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholder: {
        alignItems: 'center',
        padding: 20,
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#64748b',
        textAlign: 'center',
    },
    subText: {
        marginTop: 5,
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
    },
});
