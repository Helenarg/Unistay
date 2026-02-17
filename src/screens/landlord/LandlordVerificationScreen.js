import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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

    useEffect(() => { checkExistingVerification(); }, []);

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
            if (nicPhoto) nicPhotoURL = await uploadVerificationDoc(user.uid, nicPhoto, 'nic');
            await submitVerification(user.uid, { role: 'landlord', nic, nicPhotoURL });
            await refreshProfile();
            Alert.alert('Verification Submitted', 'Your NIC details have been sent for verification.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
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
                <ActivityIndicator size="large" color="#EF475D" />
            </SafeAreaView>
        );
    }

    if (existingVerification) {
        const st = existingVerification.status;
        const statusConfig = st === 'verified'
            ? { icon: 'shield-checkmark', bg: '#E8F5E9', color: '#27AE60', label: 'Verified', desc: 'Your identity has been verified successfully.' }
            : st === 'pending'
                ? { icon: 'time', bg: '#FFF8E1', color: '#F39C12', label: 'Pending Review', desc: 'Your documents are being reviewed. This usually takes 1-2 business days.' }
                : { icon: 'close-circle', bg: '#FEEEEF', color: '#EF475D', label: 'Rejected', desc: 'Your verification was not approved. Please try again.' };

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.content}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
                    </TouchableOpacity>
                    <View style={styles.statusPage}>
                        <View style={[styles.statusIconCircle, { backgroundColor: statusConfig.bg }]}>
                            <Ionicons name={statusConfig.icon} size={40} color={statusConfig.color} />
                        </View>
                        <Text style={styles.statusTitle}>{statusConfig.label}</Text>
                        <Text style={styles.statusDesc}>{statusConfig.desc}</Text>
                        <View style={styles.detailCard}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>NIC Number</Text>
                                <Text style={styles.detailValue}>{existingVerification.nic}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
                </TouchableOpacity>

                <View style={styles.formCard}>
                    <View style={styles.headerIconCircle}>
                        <Ionicons name="shield-checkmark" size={28} color="#EF475D" />
                    </View>
                    <Text style={styles.title}>Landlord Verification</Text>
                    <Text style={styles.subtitle}>Verify your identity to start listing properties and build trust with students.</Text>

                    <View style={styles.form}>
                        <Text style={styles.label}>NIC Number</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="card-outline" size={18} color="#999" style={styles.inputIcon} />
                            <TextInput style={styles.input} placeholder="Enter your NIC number" placeholderTextColor="#AAA" value={nic} onChangeText={setNic} editable={!loading} />
                        </View>
                    </View>

                    <View style={styles.uploadSection}>
                        <Text style={styles.uploadLabel}>Upload ID Document</Text>
                        <TouchableOpacity style={[styles.uploadButton, nicPhoto && styles.uploadButtonDone]} onPress={pickImage} disabled={loading}>
                            <View style={[styles.uploadIconCircle, nicPhoto && { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name={nicPhoto ? 'checkmark-circle' : 'camera-outline'} size={20} color={nicPhoto ? '#27AE60' : '#EF475D'} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.uploadBtnTitle}>{nicPhoto ? 'NIC Photo Selected' : 'Upload NIC Photo'}</Text>
                                <Text style={styles.uploadBtnDesc}>Front and back of your NIC</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#ccc" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={[styles.submitButton, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading} activeOpacity={0.85}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Ionicons name="shield-checkmark" size={18} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.submitButtonText}>Submit Verification</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FA', ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}) },
    content: { padding: 20, alignItems: 'center' },
    backBtn: {
        alignSelf: 'flex-start', width: 40, height: 40, borderRadius: 12,
        backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
        marginBottom: 20, borderWidth: 1, borderColor: '#E8E8E8',
    },
    formCard: {
        backgroundColor: '#fff', borderRadius: 20, padding: 32,
        width: '100%', maxWidth: 480,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06, shadowRadius: 20, elevation: 4,
        borderWidth: 1, borderColor: '#F0F0F0', alignItems: 'center',
    },
    headerIconCircle: {
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: '#FEF0F2', justifyContent: 'center', alignItems: 'center',
        marginBottom: 20,
    },
    title: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', textAlign: 'center' },
    subtitle: { fontSize: 14, color: '#717171', textAlign: 'center', marginTop: 6, marginBottom: 28, lineHeight: 22, maxWidth: 350 },
    form: { width: '100%' },
    label: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 8, marginTop: 16 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F7F8FA', borderWidth: 1, borderColor: '#E8E8E8',
        borderRadius: 12, paddingHorizontal: 14,
    },
    inputIcon: { marginRight: 10 },
    input: {
        flex: 1, paddingVertical: 14, fontSize: 15, color: '#1A1A1A',
        ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
    },
    uploadSection: { width: '100%', marginTop: 24, gap: 12 },
    uploadLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
    uploadButton: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F7F8FA', borderWidth: 1.5, borderColor: '#E8E8E8',
        borderRadius: 14, padding: 14, gap: 12,
    },
    uploadButtonDone: { borderColor: '#27AE60', backgroundColor: '#FAFFF5' },
    uploadIconCircle: {
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: '#FEF0F2', justifyContent: 'center', alignItems: 'center',
    },
    uploadBtnTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
    uploadBtnDesc: { fontSize: 12, color: '#999', marginTop: 2 },
    submitButton: {
        backgroundColor: '#EF475D', paddingVertical: 16, borderRadius: 14,
        alignItems: 'center', width: '100%', marginTop: 28,
        flexDirection: 'row', justifyContent: 'center',
    },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

    // Status Page
    statusPage: { alignItems: 'center', paddingTop: 20 },
    statusIconCircle: {
        width: 80, height: 80, borderRadius: 40,
        justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    },
    statusTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 },
    statusDesc: { fontSize: 14, color: '#717171', textAlign: 'center', maxWidth: 300, lineHeight: 22 },
    detailCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 20,
        marginTop: 24, width: '100%', maxWidth: 400,
        borderWidth: 1, borderColor: '#F0F0F0',
    },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F7F8FA' },
    detailLabel: { fontSize: 14, color: '#999', fontWeight: '500' },
    detailValue: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
});
