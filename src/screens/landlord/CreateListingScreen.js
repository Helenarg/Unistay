import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    const [photos, setPhotos] = useState([]); // Array of { uri }
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
            // 1. Create listing document first to get the ID
            const listingId = await createListing({
                landlordId: user.uid,
                title,
                description,
                price: Number(price),
                location,
                photos: [], // Will update after upload
            });

            // 2. Upload photos (if any)
            const photoURLs = [];
            for (let i = 0; i < photos.length; i++) {
                try {
                    const url = await uploadListingPhoto(listingId, photos[i].uri, i);
                    photoURLs.push(url);
                } catch (uploadErr) {
                    console.warn('Photo upload failed:', uploadErr);
                    // Continue even if a photo fails
                }
            }

            // 3. Update listing with photo URLs if any were uploaded
            if (photoURLs.length > 0) {
                const { updateDoc, doc } = await import('firebase/firestore');
                const { db } = await import('../../config/firebase');
                await updateDoc(doc(db, 'listings', listingId), { photos: photoURLs });
            }

            Alert.alert(
                'Listing Posted!',
                'Your place is now live for students to see.',
                [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]
            );
        } catch (err) {
            console.error('Error creating listing:', err);
            Alert.alert('Error', 'Failed to create listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.header}>Add New Place</Text>

                    <View style={styles.form}>
                        <Text style={styles.label}>Title *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Spacious Room near Uni"
                            value={title}
                            onChangeText={setTitle}
                            editable={!loading}
                        />

                        <Text style={styles.label}>Price (Monthly) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 15000"
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                            editable={!loading}
                        />

                        <Text style={styles.label}>Location / Address *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Address or nearby landmark"
                            value={location}
                            onChangeText={setLocation}
                            editable={!loading}
                        />

                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe the amenities, rules, etc."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                            editable={!loading}
                        />

                        <Text style={styles.label}>Photos</Text>
                        <View style={styles.photoContainer}>
                            {photos.map((photo, index) => (
                                <View key={index} style={styles.photoPreview}>
                                    <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                                    <TouchableOpacity style={styles.removePhotoBtn} onPress={() => removePhoto(index)} disabled={loading}>
                                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <TouchableOpacity style={styles.photoButton} onPress={pickPhoto} disabled={loading}>
                                <Text style={styles.plusIcon}>+</Text>
                                <Text style={styles.photoText}>Add Photos</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={[styles.postButton, loading && { opacity: 0.7 }]} onPress={handlePost} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.postButtonText}>Post Listing</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    form: {
        gap: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    photoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    photoButton: {
        width: 100,
        height: 100,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
    },
    plusIcon: {
        fontSize: 30,
        color: '#888',
    },
    photoText: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    photoPreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    photoImage: {
        width: '100%',
        height: '100%',
    },
    removePhotoBtn: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    postButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    postButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
