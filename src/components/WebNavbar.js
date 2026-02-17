import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 768;

export default function WebNavbar({ navigation }) {
    if (!isWeb) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.logoContainer} onPress={() => navigation.navigate('Welcome')}>
                <View style={styles.logoIcon}>
                    <Ionicons name="home" size={18} color="#fff" />
                </View>
                <Text style={styles.logoText}>UniStay<Text style={styles.logoDot}>.lk</Text></Text>
            </TouchableOpacity>

            {/* Center Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={16} color="#717171" style={{ marginRight: 8 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by University or City..."
                    placeholderTextColor="#999"
                    onFocus={() => navigation.navigate('FindHostels')}
                />
            </View>

            <View style={styles.navRight}>
                <View style={styles.linksContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
                        <Text style={styles.link}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('FindHostels')}>
                        <Text style={styles.link}>Find Hostels</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('LandlordHome')}>
                        <Text style={styles.link}>For Landlords</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('FAQ')}>
                        <Text style={styles.link}>FAQ</Text>
                    </TouchableOpacity>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        ...(Platform.OS === 'web' ? { position: 'sticky', top: 0, zIndex: 100 } : {}),
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
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
    logoDot: {
        color: '#EF475D',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flex: 1,
        maxWidth: 360,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#1A1A1A',
        ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
    },
    navRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    linksContainer: {
        flexDirection: 'row',
        gap: 24,
    },
    link: {
        fontSize: 15,
        color: '#555',
        fontWeight: '500',
    },
    authContainer: {
        flexDirection: 'row',
        gap: 10,
        marginLeft: 10,
    },
    loginButton: {
        paddingVertical: 9,
        paddingHorizontal: 22,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: '#EF475D',
    },
    loginText: {
        color: '#EF475D',
        fontWeight: '600',
        fontSize: 14,
    },
    signupButton: {
        paddingVertical: 9,
        paddingHorizontal: 22,
        borderRadius: 25,
        backgroundColor: '#EF475D',
    },
    signupText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});
