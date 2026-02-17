import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 768;

export default function WebFooter() {
    if (!isWeb) return null;

    return (
        <View style={styles.footerContainer}>
            <View style={styles.topSection}>
                {/* Brand */}
                <View style={styles.column}>
                    <View style={styles.brandRow}>
                        <View style={styles.logoIcon}>
                            <Ionicons name="home" size={16} color="#fff" />
                        </View>
                        <Text style={styles.brandName}>UniStay<Text style={{ color: '#EF475D' }}>.lk</Text></Text>
                    </View>
                    <Text style={styles.brandDesc}>
                        Sri Lanka's most trusted marketplace for university students to find safe, verified, and affordable accommodation.
                    </Text>
                    <View style={styles.socialRow}>
                        <SocialIcon name="logo-facebook" />
                        <SocialIcon name="logo-instagram" />
                        <SocialIcon name="logo-twitter" />
                        <SocialIcon name="logo-linkedin" />
                    </View>
                </View>

                {/* For Students */}
                <View style={styles.column}>
                    <Text style={styles.columnTitle}>For Students</Text>
                    <FooterLink text="Find Hostels" />
                    <FooterLink text="My Dashboard" />
                    <FooterLink text="How It Works" />
                    <FooterLink text="Student FAQ" />
                    <FooterLink text="Verification Guide" />
                </View>

                {/* For Landlords */}
                <View style={styles.column}>
                    <Text style={styles.columnTitle}>For Landlords</Text>
                    <FooterLink text="List Your Property" />
                    <FooterLink text="Getting Started" />
                    <FooterLink text="Landlord FAQ" />
                    <FooterLink text="Pricing Plans" />
                    <FooterLink text="Partner With Us" />
                </View>

                {/* Contact */}
                <View style={styles.column}>
                    <Text style={styles.columnTitle}>Contact Us</Text>
                    <ContactItem icon="mail-outline" text="info@unistay.lk" />
                    <ContactItem icon="call-outline" text="+94 11 234 5678" />
                    <ContactItem icon="location-outline" text="Colombo, Sri Lanka" />
                    <ContactItem icon="time-outline" text="Mon-Fri, 9am-6pm" />
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.bottomSection}>
                <Text style={styles.copyright}>© 2025 UniStay.lk. All rights reserved.</Text>
                <View style={styles.bottomLinks}>
                    <TouchableOpacity><Text style={styles.bottomLinkText}>Terms & Conditions</Text></TouchableOpacity>
                    <TouchableOpacity><Text style={styles.bottomLinkText}>Privacy Policy</Text></TouchableOpacity>
                    <TouchableOpacity><Text style={styles.bottomLinkText}>Cookie Policy</Text></TouchableOpacity>
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
            <Ionicons name={icon} size={16} color="#EF475D" style={{ marginRight: 10 }} />
            <Text style={styles.contactText}>{text}</Text>
        </View>
    );
}

function SocialIcon({ name }) {
    return (
        <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name={name} size={16} color="#fff" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
        backgroundColor: '#1A1A2E',
        paddingVertical: 60,
        paddingHorizontal: 80,
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
        minWidth: 180,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoIcon: {
        backgroundColor: '#EF475D',
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    brandName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
    },
    brandDesc: {
        color: '#8B8BA3',
        lineHeight: 22,
        marginBottom: 20,
        fontSize: 14,
    },
    socialRow: {
        flexDirection: 'row',
        gap: 10,
    },
    socialIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2D2D4A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    columnTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 20,
        letterSpacing: 0.5,
    },
    linkButton: {
        marginBottom: 12,
    },
    linkText: {
        color: '#8B8BA3',
        fontSize: 14,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    contactText: {
        color: '#8B8BA3',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#2D2D4A',
        marginBottom: 30,
    },
    bottomSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    copyright: {
        color: '#5A5A7A',
        fontSize: 13,
    },
    bottomLinks: {
        flexDirection: 'row',
        gap: 24,
    },
    bottomLinkText: {
        color: '#5A5A7A',
        fontSize: 13,
    },
});
