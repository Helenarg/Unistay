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
        {
            id: 1,
            category: 'Payments',
            question: 'How does the payment escrow work?',
            answer: 'We hold your payment securely until you move in and confirm that the accommodation matches the listing. This protects you from scams and ensures landlords get paid only when the contract is honored.'
        },
        {
            id: 2,
            category: 'Safety & Security',
            question: 'Are all hostels verified?',
            answer: 'Yes, UniStay verifies the identity of landlords and conducts spot checks on listed properties to ensure safety and quality standards.'
        },
        {
            id: 3,
            category: 'For Students',
            question: 'Can I cancel my booking?',
            answer: 'Cancellation policies depend on the specific landlord’s terms. You can view the cancellation policy on the property listing page before booking.'
        },
        {
            id: 4,
            category: 'For Students',
            question: 'How does roommate matching work?',
            answer: 'Our smart algorithm suggests roommates based on your study habits, sleep schedule, and interests to ensure a harmonious living environment.'
        },
        {
            id: 5,
            category: 'For Students',
            question: 'What if I have issues with my accommodation?',
            answer: 'If you encounter any issues, you can report them through the "My Dashboard" section. Our support team will mediate between you and the landlord.'
        },
        {
            id: 6,
            category: 'Payments',
            question: 'Is there a fee for students?',
            answer: 'UniStay is free for students to search and browse. A small service fee is applied only when a booking is confirmed to cover platform maintenance.'
        },
        {
            id: 7,
            category: 'Safety & Security',
            question: '⁠Is UniStay.lk safe to use?',
            answer: 'Yes. All landlords and properties on UniStay.lk go through a verification process. We verify owner identity, property documents, and listings before approval. Payments are handled securely through the platform to avoid scams.'
        }

    ];

    const toggleQuestion = (id) => {
        setOpenQuestionId(openQuestionId === id ? null : id);
    };

    const filteredFAQs = faqData.filter(item => {
        const matchesCategory = selectedCategory === 'All Questions' || item.category === selectedCategory;
        const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <View style={styles.container}>
            <WebNavbar navigation={navigation} />

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>How Can We Help You?</Text>
                        <Text style={styles.heroSubtitle}>Find answers to common questions about UniStay.lk</Text>

                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="#fff" style={{ marginRight: 10 }} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search for help..."
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>
                </View>

                {/* FAQ Content */}
                <View style={styles.contentContainer}>

                    {/* Categories */}
                    <View style={styles.categoryContainer}>
                        {categories.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
                                onPress={() => {
                                    setSelectedCategory(cat);
                                    setOpenQuestionId(null);
                                }}
                            >
                                <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Questions List */}
                    <View style={styles.questionsList}>
                        {filteredFAQs.map(item => (
                            <View key={item.id} style={styles.accordionContainer}>
                                <TouchableOpacity
                                    style={styles.accordionHeader}
                                    onPress={() => toggleQuestion(item.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.questionText}>{item.question}</Text>
                                    <Ionicons
                                        name={openQuestionId === item.id ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color="#9ca3af"
                                    />
                                </TouchableOpacity>
                                {openQuestionId === item.id && (
                                    <View style={styles.accordionBody}>
                                        <Text style={styles.answerText}>{item.answer}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Support Contact Section */}
                    <View style={styles.supportContainer}>
                        <View style={styles.supportBox}>
                            <View style={{ marginBottom: 15 }}>
                                <Ionicons name="chatbubble-ellipses-outline" size={48} color="#3b82f6" style={{ alignSelf: 'center' }} />
                            </View>
                            <Text style={styles.supportTitle}>Still Have Questions?</Text>
                            <Text style={styles.supportSubtitle}>Our support team is here to help you 24/7</Text>

                            <View style={styles.supportButtons}>
                                <TouchableOpacity style={styles.btnPrimary}>
                                    <Ionicons name="chatbubble-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.btnPrimaryText}>Chat with Support</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnSecondary}>
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
        height: Platform.OS === 'web' ? '100vh' : '100%',
    },

    // Hero
    heroSection: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007AFF', // Fallback
        // Web-only gradient simulation (React Native Web accepts CSS background)
        ...Platform.select({
            web: {
                backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            }
        }),
    },
    heroContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%',
        maxWidth: 800,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 30,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        width: '100%',
        maxWidth: 500,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        outlineStyle: 'none', // Web only
    },

    // Content
    contentContainer: {
        maxWidth: 1000,
        width: '100%',
        alignSelf: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },

    // Categories
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 40,
    },
    categoryPill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    categoryPillActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    categoryText: {
        color: '#4b5563',
        fontWeight: '500',
    },
    categoryTextActive: {
        color: '#fff',
    },

    // Questions
    questionsList: {
        gap: 15,
        marginBottom: 60,
    },
    accordionContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        overflow: 'hidden',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    questionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        flex: 1,
        marginRight: 10,
    },
    accordionBody: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 15,
    },
    answerText: {
        fontSize: 15,
        color: '#6b7280',
        lineHeight: 22,
    },

    // Support Box
    supportContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    supportBox: {
        backgroundColor: '#eff6ff', // light blue
        borderRadius: 16,
        padding: 40,
        width: '100%',
        maxWidth: 700,
        alignItems: 'center',
    },
    supportTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 10,
    },
    supportSubtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 30,
        textAlign: 'center',
    },
    supportButtons: {
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    btnPrimary: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    btnPrimaryText: {
        color: '#fff',
        fontWeight: '600',
    },
    btnSecondary: {
        backgroundColor: 'transparent',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3b82f6',
    },
    btnSecondaryText: {
        color: '#3b82f6',
        fontWeight: '600',
    },
});
