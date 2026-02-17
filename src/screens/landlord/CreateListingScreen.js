import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { createListing } from '../../services/firestoreService';
import { uploadListingPhoto } from '../../services/storageService';

export default function CreateListingScreen({ navigation }) {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);

    const pickPhoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
        });
        if (!result.canceled && result.assets[0]) {
            setPhotos(prev => [...prev, { uri: result.assets[0].uri }]);
        }
    };

    const removePhoto = (index) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handlePost = async () => {
        if (!title || !price || !location) {
            Alert.alert('Missing Fields', 'Please fill in the required fields.');
            return;
        }
        if (!user) {
            Alert.alert('Error', 'You must be logged in to create a listing.');
            return;
        }
        setLoading(true);
        try {
            const listingId = await createListing({
                landlordId: user.uid,
                title, description,
                price: Number(price),
                location,
                photos: [],
            });
            const photoURLs = [];
            for (let i = 0; i < photos.length; i++) {
                try {
                    const url = await uploadListingPhoto(listingId, photos[i].uri, i);
                    photoURLs.push(url);
                } catch (uploadErr) {
                    console.warn('Photo upload failed:', uploadErr);
                }
            }
            if (photoURLs.length > 0) {
                const { updateDoc, doc } = await import('firebase/firestore');
                const { db } = await import('../../config/firebase');
                await updateDoc(doc(db, 'listings', listingId), { photos: photoURLs });
            }
            Alert.alert('Listing Posted!', 'Your place is now live for students to see.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
        } catch (err) {
            console.error('Error creating listing:', err);
            Alert.alert('Error', 'Failed to create listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
                    </TouchableOpacity>

                    <View style={styles.formCard}>
                        <View style={styles.headerIconCircle}>
                            <Ionicons name="business" size={28} color="#EF475D" />
                        </View>
                        <Text style={styles.header}>Add New Property</Text>
                        <Text style={styles.subheader}>Create a listing to attract students looking for accommodation</Text>

                        <View style={styles.form}>
                            <Text style={styles.label}>Property Title <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="home-outline" size={18} color="#999" style={styles.inputIcon} />
                                <TextInput style={styles.input} placeholder="e.g. Spacious Room near Uni" placeholderTextColor="#AAA" value={title} onChangeText={setTitle} editable={!loading} />
                            </View>

                            <Text style={styles.label}>Monthly Price <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.currencyPrefix}>Rs.</Text>
                                <TextInput style={styles.input} placeholder="e.g. 15000" placeholderTextColor="#AAA" value={price} onChangeText={setPrice} keyboardType="numeric" editable={!loading} />
                            </View>

                            <Text style={styles.label}>Location / Address <Text style={styles.required}>*</Text></Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="location-outline" size={18} color="#999" style={styles.inputIcon} />
                                <TextInput style={styles.input} placeholder="Address or nearby landmark" placeholderTextColor="#AAA" value={location} onChangeText={setLocation} editable={!loading} />
                            </View>

                            <Text style={styles.label}>Description</Text>
                            <View style={[styles.inputContainer, { alignItems: 'flex-start' }]}>
                                <Ionicons name="document-text-outline" size={18} color="#999" style={[styles.inputIcon, { marginTop: 14 }]} />
                                <TextInput style={[styles.input, styles.textArea]} placeholder="Describe amenities, rules, etc." placeholderTextColor="#AAA" value={description} onChangeText={setDescription} multiline numberOfLines={4} editable={!loading} />
                            </View>

                            <Text style={styles.label}>Photos</Text>
                            <View style={styles.photoContainer}>
                                {photos.map((photo, index) => (
                                    <View key={index} style={styles.photoPreview}>
                                        <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                                        <TouchableOpacity style={styles.removePhotoBtn} onPress={() => removePhoto(index)} disabled={loading}>
                                            <Ionicons name="close" size={14} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                <TouchableOpacity style={styles.photoButton} onPress={pickPhoto} disabled={loading}>
                                    <Ionicons name="camera-outline" size={24} color="#EF475D" />
                                    <Text style={styles.photoText}>Add Photos</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={[styles.postButton, loading && { opacity: 0.7 }]} onPress={handlePost} disabled={loading} activeOpacity={0.85}>
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="cloud-upload-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                                        <Text style={styles.postButtonText}>Post Listing</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FA', ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}) },
    content: { padding: 20, alignItems: 'center' },
    backBtn: {
        alignSelf: 'flex-start',
        width: 40, height: 40, borderRadius: 12,
        backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
        marginBottom: 20, borderWidth: 1, borderColor: '#E8E8E8',
    },
    formCard: {
        backgroundColor: '#fff', borderRadius: 20, padding: 32,
        width: '100%', maxWidth: 540,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06, shadowRadius: 20, elevation: 4,
        borderWidth: 1, borderColor: '#F0F0F0', alignItems: 'center',
    },
    headerIconCircle: {
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: '#FEF0F2', justifyContent: 'center', alignItems: 'center',
        marginBottom: 20,
    },
    header: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', textAlign: 'center' },
    subheader: { fontSize: 14, color: '#717171', textAlign: 'center', marginTop: 6, marginBottom: 28, maxWidth: 400 },
    form: { width: '100%', gap: 4 },
    label: { fontSize: 13, fontWeight: '600', color: '#1A1A1A', marginBottom: 8, marginTop: 14 },
    required: { color: '#EF475D' },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F7F8FA', borderWidth: 1, borderColor: '#E8E8E8',
        borderRadius: 12, paddingHorizontal: 14,
    },
    inputIcon: { marginRight: 10 },
    currencyPrefix: { color: '#EF475D', fontWeight: '700', fontSize: 14, marginRight: 8 },
    input: {
        flex: 1, paddingVertical: 14, fontSize: 15, color: '#1A1A1A',
        ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    photoContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8, marginBottom: 8 },
    photoButton: {
        width: 100, height: 100, backgroundColor: '#FEF0F2', borderRadius: 14,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1.5, borderColor: '#FECEDF', borderStyle: 'dashed',
    },
    photoText: { fontSize: 11, color: '#EF475D', marginTop: 4, fontWeight: '600' },
    photoPreview: { width: 100, height: 100, borderRadius: 14, overflow: 'hidden', position: 'relative' },
    photoImage: { width: '100%', height: '100%' },
    removePhotoBtn: {
        position: 'absolute', top: 6, right: 6,
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center',
    },
    postButton: {
        backgroundColor: '#EF475D', paddingVertical: 16, borderRadius: 14,
        alignItems: 'center', marginTop: 20,
        flexDirection: 'row', justifyContent: 'center',
    },
    postButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
