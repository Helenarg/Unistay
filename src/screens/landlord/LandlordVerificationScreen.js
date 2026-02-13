import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { submitVerification, getVerificationStatus } from '../../services/firestoreService';
import { uploadVerificationDoc } from '../../services/storageService';

export default function LandlordVerificationScreen({ navigation }) {
    const { user, refreshProfile } = useAuth();
    const [nic, setNic] = useState('');
    const [nicPhoto, setNicPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [existingVerification, setExistingVerification] = useState(null);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        checkExistingVerification();
    }, []);

    const checkExistingVerification = async () => {
        try {
            if (user) {
                const status = await getVerificationStatus(user.uid);
                setExistingVerification(status);
            }
        } catch (err) {
            console.error('Error checking verification:', err);
        } finally {
            setCheckingStatus(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled && result.assets[0]) {
            setNicPhoto(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!nic) {
            Alert.alert('Missing Field', 'Please enter your NIC number.');
            return;
        }

        setLoading(true);
        try {
            let nicPhotoURL = null;

            if (nicPhoto) {
                nicPhotoURL = await uploadVerificationDoc(user.uid, nicPhoto, 'nic');
            }

            await submitVerification(user.uid, {
                role: 'landlord',
                nic,
                nicPhotoURL,
            });

            await refreshProfile();

            Alert.alert(
                'Verification Submitted',
                'Your NIC details have been sent for verification.',
                [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]
            );
        } catch (err) {
            console.error('Verification error:', err);
            Alert.alert('Error', 'Failed to submit verification. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (checkingStatus) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007AFF" />
            </SafeAreaView>
        );
    }

    // Show status if already submitted
    if (existingVerification) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.title}>Verification Status</Text>
                    <View style={styles.statusCard}>
                        <View style={[styles.statusIndicator, {
                            backgroundColor: existingVerification.status === 'verified' ? '#d4edda' :
                                existingVerification.status === 'pending' ? '#fff3cd' : '#f8d7da'
                        }]}>
                            <Text style={[styles.statusLabel, {
                                color: existingVerification.status === 'verified' ? '#155724' :
                                    existingVerification.status === 'pending' ? '#856404' : '#721c24'
                            }]}>
                                {existingVerification.status === 'verified' ? '✓ Verified' :
                                    existingVerification.status === 'pending' ? '⏳ Pending Review' : '✕ Rejected'}
                            </Text>
                        </View>
                        <Text style={styles.statusDetail}>NIC: {existingVerification.nic}</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Landlord Verification</Text>
                <Text style={styles.subtitle}>
                    Verify your identity to start listing places.
                </Text>

                <View style={styles.formSection}>
                    <Text style={styles.label}>NIC Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your NIC number"
                        value={nic}
                        onChangeText={setNic}
                        editable={!loading}
                    />
                </View>

                <View style={styles.uploadSection}>
                    <Text style={styles.label}>Upload ID Document</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={pickImage} disabled={loading}>
                        <Text style={styles.uploadButtonText}>
                            {nicPhoto ? '✓ NIC Photo Selected' : 'Upload NIC Photo (Front/Back)'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={[styles.submitButton, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Submit Verification</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        lineHeight: 24,
    },
    formSection: {
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
    },
    uploadSection: {
        marginBottom: 30,
        gap: 15,
    },
    uploadButton: {
        borderWidth: 2,
        borderColor: '#007AFF',
        borderStyle: 'dashed',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f0f9ff',
    },
    uploadButtonText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    statusCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    statusIndicator: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 15,
    },
    statusLabel: {
        fontWeight: '600',
        fontSize: 16,
    },
    statusDetail: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});
