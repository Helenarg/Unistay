import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { signIn } from '../../services/authService';
import { getUserProfile } from '../../services/firestoreService';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const credential = await signIn(email, password);
            const profile = await getUserProfile(credential.user.uid);

            if (profile?.role === 'landlord') {
                navigation.replace('LandlordHome');
            } else {
                navigation.replace('StudentHome');
            }
        } catch (error) {
            let message = 'Login failed. Please try again.';
            if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
            else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') message = 'Incorrect password.';
            else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
            else if (error.code === 'auth/too-many-requests') message = 'Too many attempts. Please try again later.';
            Alert.alert('Login Failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'center' }}>
                <View style={styles.content}>
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

                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to your account to continue</Text>

                        <View style={styles.form}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={18} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="email@example.com"
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
                                    placeholder="Enter your password"
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

                            <TouchableOpacity style={styles.forgotBtn}>
                                <Text style={styles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleLogin}
                                disabled={loading}
                                activeOpacity={0.85}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Sign In</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.link}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
    content: {
        padding: 20,
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
        marginBottom: 28,
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
        marginBottom: 28,
    },
    form: { width: '100%' },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
        marginTop: 16,
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
    forgotBtn: {
        alignSelf: 'flex-end',
        marginTop: 8,
        marginBottom: 4,
    },
    forgotText: {
        color: '#EF475D',
        fontSize: 13,
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#EF475D',
        marginTop: 24,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonDisabled: { opacity: 0.7 },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: { color: '#717171', fontSize: 14 },
    link: { color: '#EF475D', fontWeight: '700', fontSize: 14 },
});
