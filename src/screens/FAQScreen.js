import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import WebNavbar from '../components/WebNavbar';
import WebFooter from '../components/WebFooter';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function FAQScreen({ navigation }) {
    const [selectedCategory, setSelectedCategory] = useState('All Questions');
    const [openQuestionId, setOpenQuestionId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All Questions', 'For Students', 'For Landlords', 'Payments', 'Safety & Security'];

    const faqData = [
        { id: 1, category: 'Payments', question: 'How does the payment escrow work?', answer: 'We hold your payment securely until you move in and confirm that the accommodation matches the listing. This protects you from scams and ensures landlords get paid only when the contract is honored.' },
        { id: 2, category: 'Safety & Security', question: 'Are all hostels verified?', answer: 'Yes, UniStay verifies the identity of landlords and conducts spot checks on listed properties to ensure safety and quality standards.' },
        { id: 3, category: 'For Students', question: 'Can I cancel my booking?', answer: 'Cancellation policies depend on the specific landlord\'s terms. You can view the cancellation policy on the property listing page before booking.' },
        { id: 4, category: 'For Students', question: 'How does roommate matching work?', answer: 'Our smart algorithm suggests roommates based on your study habits, sleep schedule, and interests to ensure a harmonious living environment.' },
        { id: 5, category: 'For Students', question: 'What if I have issues with my accommodation?', answer: 'If you encounter any issues, you can report them through the "My Dashboard" section. Our support team will mediate between you and the landlord.' },
        { id: 6, category: 'Payments', question: 'Is there a fee for students?', answer: 'UniStay is free for students to search and browse. A small service fee is applied only when a booking is confirmed to cover platform maintenance.' },
        { id: 7, category: 'Safety & Security', question: 'Is UniStay.lk safe to use?', answer: 'Yes. All landlords and properties on UniStay.lk go through a verification process. We verify owner identity, property documents, and listings before approval. Payments are handled securely through the platform to avoid scams.' },
    ];

    const toggleQuestion = (id) => setOpenQuestionId(openQuestionId === id ? null : id);

    const filteredFAQs = faqData.filter(item => {
        const matchesCategory = selectedCategory === 'All Questions' || item.category === selectedCategory;
        const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <View style={styles.container}>
            <WebNavbar navigation={navigation} />

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                {/* Hero */}
                <View style={styles.heroSection}>
                    <View style={styles.heroContent}>
                        <View style={styles.heroBadge}>
                            <Ionicons name="help-circle" size={14} color="#EF475D" />
                            <Text style={styles.heroBadgeText}>HELP CENTER</Text>
                        </View>
                        <Text style={styles.heroTitle}>How Can We{'\n'}<Text style={{ color: '#EF475D' }}>Help You?</Text></Text>
                        <Text style={styles.heroSubtitle}>Find answers to common questions about UniStay.lk</Text>

                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={18} color="#999" style={{ marginRight: 10 }} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search for help..."
                                placeholderTextColor="#AAA"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Ionicons name="close-circle" size={18} color="#ccc" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    {/* Categories */}
                    <View style={styles.categoryContainer}>
                        {categories.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
                                onPress={() => { setSelectedCategory(cat); setOpenQuestionId(null); }}
                            >
                                <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* FAQ List */}
                    <View style={styles.questionsList}>
                        {filteredFAQs.map(item => (
                            <View key={item.id} style={[styles.accordionContainer, openQuestionId === item.id && styles.accordionOpen]}>
                                <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleQuestion(item.id)} activeOpacity={0.7}>
                                    <Text style={styles.questionText}>{item.question}</Text>
                                    <View style={[styles.chevronCircle, openQuestionId === item.id && styles.chevronCircleActive]}>
                                        <Ionicons name={openQuestionId === item.id ? 'chevron-up' : 'chevron-down'} size={16} color={openQuestionId === item.id ? '#fff' : '#999'} />
                                    </View>
                                </TouchableOpacity>
                                {openQuestionId === item.id && (
                                    <View style={styles.accordionBody}>
                                        <Text style={styles.answerText}>{item.answer}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Support */}
                    <View style={styles.supportContainer}>
                        <View style={styles.supportBox}>
                            <View style={styles.supportIcon}>
                                <Ionicons name="chatbubble-ellipses-outline" size={36} color="#EF475D" />
                            </View>
                            <Text style={styles.supportTitle}>Still Have Questions?</Text>
                            <Text style={styles.supportSubtitle}>Our support team is here to help you 24/7</Text>

                            <View style={styles.supportButtons}>
                                <TouchableOpacity style={styles.btnPrimary}>
                                    <Ionicons name="chatbubble-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.btnPrimaryText}>Chat with Support</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnSecondary}>
                                    <Ionicons name="mail-outline" size={16} color="#EF475D" style={{ marginRight: 8 }} />
                                    <Text style={styles.btnSecondaryText}>Email Us</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                <WebFooter />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F8FA', ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}) },

    // Hero
    heroSection: {
        paddingVertical: 60,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1A1A2E',
    },
    heroContent: { alignItems: 'center', width: '100%', maxWidth: 800 },
    heroBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#FEF0F2', paddingHorizontal: 14, paddingVertical: 6,
        borderRadius: 20, marginBottom: 20,
    },
    heroBadgeText: { color: '#EF475D', fontWeight: '700', fontSize: 12, letterSpacing: 1 },
    heroTitle: { fontSize: 36, fontWeight: '800', color: '#fff', marginBottom: 12, textAlign: 'center', lineHeight: 44 },
    heroSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 30, textAlign: 'center' },
    searchContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: 14,
        paddingHorizontal: 16, paddingVertical: 14,
        width: '100%', maxWidth: 500,
        borderWidth: 1, borderColor: '#F0F0F0',
    },
    searchInput: {
        flex: 1, fontSize: 15, color: '#1A1A1A',
        ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
    },

    // Content
    contentContainer: { maxWidth: 900, width: '100%', alignSelf: 'center', paddingVertical: 40, paddingHorizontal: 20 },

    // Categories
    categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 40 },
    categoryPill: {
        paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25,
        backgroundColor: '#fff', borderWidth: 1, borderColor: '#E8E8E8',
    },
    categoryPillActive: { backgroundColor: '#EF475D', borderColor: '#EF475D' },
    categoryText: { color: '#717171', fontWeight: '600', fontSize: 14 },
    categoryTextActive: { color: '#fff' },

    // Accordion
    questionsList: { gap: 12, marginBottom: 50 },
    accordionContainer: {
        backgroundColor: '#fff', borderRadius: 16,
        borderWidth: 1, borderColor: '#F0F0F0', overflow: 'hidden',
    },
    accordionOpen: { borderColor: '#EF475D', borderWidth: 1.5 },
    accordionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', padding: 20,
    },
    questionText: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', flex: 1, marginRight: 12 },
    chevronCircle: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: '#F7F8FA', justifyContent: 'center', alignItems: 'center',
    },
    chevronCircleActive: { backgroundColor: '#EF475D' },
    accordionBody: { paddingHorizontal: 20, paddingBottom: 20, borderTopWidth: 1, borderTopColor: '#F7F8FA', paddingTop: 16 },
    answerText: { fontSize: 15, color: '#717171', lineHeight: 24 },

    // Support
    supportContainer: { alignItems: 'center', marginBottom: 40 },
    supportBox: {
        backgroundColor: '#fff', borderRadius: 20, padding: 40,
        width: '100%', maxWidth: 700, alignItems: 'center',
        borderWidth: 1, borderColor: '#F0F0F0',
    },
    supportIcon: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: '#FEF0F2', justifyContent: 'center', alignItems: 'center',
        marginBottom: 20,
    },
    supportTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginBottom: 8 },
    supportSubtitle: { fontSize: 15, color: '#717171', marginBottom: 28, textAlign: 'center' },
    supportButtons: { flexDirection: 'row', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
    btnPrimary: {
        backgroundColor: '#EF475D', paddingHorizontal: 24, paddingVertical: 14,
        borderRadius: 12, flexDirection: 'row', alignItems: 'center',
    },
    btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    btnSecondary: {
        backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 14,
        borderRadius: 12, borderWidth: 1.5, borderColor: '#EF475D',
        flexDirection: 'row', alignItems: 'center',
    },
    btnSecondaryText: { color: '#EF475D', fontWeight: '700', fontSize: 14 },
});
