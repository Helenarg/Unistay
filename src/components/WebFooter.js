import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 768;

export default function WebFooter() {
    if (!isWeb) return null; // Or render a simplified mobile footer

    return (
        <View style={styles.footerContainer}>
            <View style={styles.topSection}>
                {/* Column 1: Brand */}
                <View style={styles.column}>
                    <View style={styles.brandRow}>
                        <View style={styles.logoIcon}><Text>🏠</Text></View>
                        <Text style={styles.brandName}>UniStay.lk</Text>
                    </View>
                    <Text style={styles.brandDesc}>
                        Sri Lanka's trusted marketplace for university students to find safe, verified, and affordable hostels.
                    </Text>
                    <View style={styles.socialRow}>
                        <SocialIcon icon="f" />
                        <SocialIcon icon="in" />
                        <SocialIcon icon="tw" />
                    </View>
                </View>

                {/* Column 2: For Students */}
                <View style={styles.column}>
                    <Text style={styles.columnTitle}>For Students</Text>
                    <FooterLink text="Find Hostels" />
                    <FooterLink text="My Dashboard" />
                    <FooterLink text="How It Works" />
                    <FooterLink text="Student FAQ" />
                </View>

                {/* Column 3: For Landlords */}
                <View style={styles.column}>
                    <Text style={styles.columnTitle}>For Landlords</Text>
                    <FooterLink text="List Your Property" />
                    <FooterLink text="Getting Started" />
                    <FooterLink text="Landlord FAQ" />
                    <FooterLink text="Pricing" />
                </View>

                {/* Column 4: Contact Us */}
                <View style={styles.column}>
                    <Text style={styles.columnTitle}>Contact Us</Text>
                    <ContactItem icon="✉️" text="support@unistay.lk" />
                    <ContactItem icon="📞" text="+94 11 234 5678" />
                    <ContactItem icon="📍" text="Colombo, Sri Lanka" />
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.bottomSection}>
                <Text style={styles.copyright}>© 2024 UniStay.lk. All rights reserved.</Text>
                <View style={styles.bottomLinks}>
                    <TouchableOpacity><Text style={styles.bottomLinkText}>Terms & Conditions</Text></TouchableOpacity>
                    <TouchableOpacity><Text style={styles.bottomLinkText}>Privacy Policy</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

function FooterLink({ text }) {
    return (
        <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>{text}</Text>
        </TouchableOpacity>
    );
}

function ContactItem({ icon, text }) {
    return (
        <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>{icon}</Text>
            <Text style={styles.contactText}>{text}</Text>
        </View>
    );
}

function SocialIcon({ icon }) {
    return (
        <TouchableOpacity style={styles.socialIcon}>
            <Text style={{ color: '#fff' }}>{icon}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
        backgroundColor: '#1a202c', // Dark slate/bluegray
        paddingVertical: 60,
        paddingHorizontal: 100,
        width: '100%',
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 40,
        marginBottom: 40,
    },
    column: {
        flex: 1,
        minWidth: 200,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    logoIcon: {
        backgroundColor: '#00afb9',
        padding: 5,
        borderRadius: 5,
        marginRight: 10,
    },
    brandName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    brandDesc: {
        color: '#a0aec0',
        lineHeight: 24,
        marginBottom: 20,
    },
    socialRow: {
        flexDirection: 'row',
        gap: 10,
    },
    socialIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4a5568',
        justifyContent: 'center',
        alignItems: 'center',
    },
    columnTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    linkButton: {
        marginBottom: 12,
    },
    linkText: {
        color: '#a0aec0',
        fontSize: 14,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    contactIcon: {
        marginRight: 10,
        fontSize: 16,
    },
    contactText: {
        color: '#a0aec0',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#2d3748',
        marginBottom: 30,
    },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    copyright: {
        color: '#718096',
        fontSize: 14,
    },
    bottomLinks: {
        flexDirection: 'row',
        gap: 20,
    },
    bottomLinkText: {
        color: '#718096',
        fontSize: 14,
    },
});
