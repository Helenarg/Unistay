import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 768;

export default function WebNavbar({ navigation }) {
    if (!isWeb) return null; // Simple mobile handling for now, or use a Drawer

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.logoIcon}>
                    <Text style={styles.homeIcon}>🏠</Text>
                </View>
                <Text style={styles.logoText}>UniStay.lk</Text>
            </View>

            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Welcome')}><Text style={styles.link}>Home</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FindHostels')}><Text style={styles.link}>Find Hostels</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('LandlordHome')}><Text style={styles.link}>For Landlords</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FAQ')}><Text style={styles.link}>FAQ</Text></TouchableOpacity>
            </View>

            <View style={styles.authContainer}>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.signupButton}
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={styles.signupText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logoIcon: {
        backgroundColor: '#00afb9',
        padding: 8,
        borderRadius: 8,
    },
    homeIcon: {
        fontSize: 20,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    linksContainer: {
        flexDirection: 'row',
        gap: 30,
    },
    link: {
        fontSize: 16,
        color: '#555',
    },
    authContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    loginButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    loginText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    signupButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#007AFF',
    },
    signupText: {
        color: '#fff',
        fontWeight: '600',
    },
});
