import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signUp } from '../../services/authService';
import { createUserProfile } from '../../services/firestoreService';

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const credential = await signUp(email, password, name);
            await createUserProfile(credential.user.uid, { name, email, role });
            if (role === 'student') {
                navigation.replace('StudentHome');
            } else {
                navigation.replace('LandlordHome');
            }
        } catch (error) {
            let message = 'Signup failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') message = 'An account with this email already exists.';
            else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
            else if (error.code === 'auth/weak-password') message = 'Password is too weak. Use at least 6 characters.';
            Alert.alert('Signup Failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Back button */}
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
                    </TouchableOpacity>

                    <View style={styles.formCard}>
                        {/* Logo */}
                        <View style={styles.logoRow}>
                            <View style={styles.logoIcon}>
                                <Ionicons name="home" size={20} color="#fff" />
                            </View>
                            <Text style={styles.logoText}>UniStay<Text style={{ color: '#EF475D' }}>.lk</Text></Text>
                        </View>

                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join UniStay and find your perfect home</Text>

                        {/* Role Selector */}
                        <View style={styles.roleContainer}>
                            <Text style={styles.label}>I am a:</Text>
                            <View style={styles.roleSelector}>
                                <TouchableOpacity
                                    style={[styles.roleButton, role === 'student' && styles.roleButtonActive]}
                                    onPress={() => setRole('student')}
                                    disabled={loading}
                                >
                                    <Ionicons name="school-outline" size={16} color={role === 'student' ? '#EF475D' : '#999'} style={{ marginRight: 6 }} />
                                    <Text style={[styles.roleText, role === 'student' && styles.roleTextActive]}>Student</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.roleButton, role === 'landlord' && styles.roleButtonActive]}
                                    onPress={() => setRole('landlord')}
                                    disabled={loading}
                                >
                                    <Ionicons name="business-outline" size={16} color={role === 'landlord' ? '#EF475D' : '#999'} style={{ marginRight: 6 }} />
                                    <Text style={[styles.roleText, role === 'landlord' && styles.roleTextActive]}>Landlord</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.form}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={18} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="John Doe"
                                    placeholderTextColor="#AAA"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    editable={!loading}
                                />
                            </View>

                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={18} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="john@example.com"
                                    placeholderTextColor="#AAA"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!loading}
                                />
                            </View>

                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={18} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Min 6 characters"
                                    placeholderTextColor="#AAA"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    editable={!loading}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#999" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleSignup}
                                disabled={loading}
                                activeOpacity={0.85}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Create Account</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.link}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}),
    },
    scrollContent: {
        padding: 20,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backBtn: {
        alignSelf: 'flex-start',
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 36,
        width: '100%',
        maxWidth: 420,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
        justifyContent: 'center',
    },
    logoIcon: {
        backgroundColor: '#EF475D',
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1A1A',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1A1A1A',
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 15,
        color: '#717171',
        marginTop: 6,
        textAlign: 'center',
        marginBottom: 24,
    },
    roleContainer: { marginBottom: 8 },
    roleSelector: {
        flexDirection: 'row',
        backgroundColor: '#F7F8FA',
        borderRadius: 14,
        padding: 4,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    roleButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    roleButtonActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    roleText: { fontWeight: '600', color: '#999', fontSize: 14 },
    roleTextActive: { color: '#EF475D' },
    form: { width: '100%' },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
        marginTop: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        paddingHorizontal: 14,
    },
    inputIcon: { marginRight: 10 },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
        color: '#1A1A1A',
        ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
    },
    button: {
        backgroundColor: '#EF475D',
        marginTop: 28,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: { color: '#717171', fontSize: 14 },
    link: { color: '#EF475D', fontWeight: '700', fontSize: 14 },
});
