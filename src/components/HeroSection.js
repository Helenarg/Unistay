import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 768;

// Calendar helpers
const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

export default function HeroSection() {
    const [university, setUniversity] = useState(null);
    const [moveInDate, setMoveInDate] = useState('29/01/2026');
    const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 29));
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
    const [budget, setBudget] = useState(null);
    const [roomType, setRoomType] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const universities = [
        'University of Colombo', 'University of Moratuwa', 'University of Peradeniya',
        'University of Kelaniya', 'University of Ruhuna', 'University of Sri Jayewardenepura'
    ];
    const budgetRanges = ['Any Budget', '< Rs. 10,000', 'Rs. 10,000 - 20,000', 'Rs. 20,000 - 30,000', '> Rs. 30,000'];
    const roomTypes = ['Any Room Type', 'Single Room', 'Shared (2 Person)', 'Shared (3 Person)', 'Shared (4 Person)'];

    const toggleDropdown = (name) => setActiveDropdown(activeDropdown === name ? null : name);
    const selectOption = (setter, value) => { setter(value); setActiveDropdown(null); };

    const handleDateSelect = (day) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(newDate);
        setMoveInDate(`${String(day).padStart(2, '0')}/${String(currentMonth.getMonth() + 1).padStart(2, '0')}/${currentMonth.getFullYear()}`);
        setActiveDropdown(null);
    };

    const changeMonth = (increment) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1));
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const numDays = daysInMonth(month, year);
        const startDay = firstDayOfMonth(month, year);
        const days = [];
        for (let i = 0; i < startDay; i++) days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
        for (let i = 1; i <= numDays; i++) {
            const isSelected = selectedDate.getDate() === i && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
            days.push(
                <TouchableOpacity key={i} style={[styles.dayCell, isSelected && styles.selectedDayCell]} onPress={() => handleDateSelect(i)}>
                    <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{i}</Text>
                </TouchableOpacity>
            );
        }
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return (
            <View style={styles.calendarContainer}>
                <View style={styles.calendarHeader}>
                    <TouchableOpacity onPress={() => changeMonth(-1)}>
                        <Ionicons name="chevron-back" size={18} color="#EF475D" />
                    </TouchableOpacity>
                    <Text style={styles.calendarTitle}>{monthNames[month]} {year}</Text>
                    <TouchableOpacity onPress={() => changeMonth(1)}>
                        <Ionicons name="chevron-forward" size={18} color="#EF475D" />
                    </TouchableOpacity>
                </View>
                <View style={styles.daysGrid}>
                    <View style={styles.weekRow}>
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                            <Text key={i} style={styles.weekDayText}>{d}</Text>
                        ))}
                    </View>
                    <View style={styles.daysRow}>{days}</View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Trust badges */}
            <View style={styles.trustBadges}>
                <View style={styles.badge}>
                    <Ionicons name="shield-checkmark" size={14} color="#27AE60" />
                    <Text style={styles.badgeText}>Verified Properties</Text>
                </View>
                <View style={styles.badge}>
                    <Ionicons name="flash" size={14} color="#EF475D" />
                    <Text style={styles.badgeText}>Instant Booking</Text>
                </View>
                <View style={styles.badge}>
                    <Ionicons name="star" size={14} color="#F39C12" />
                    <Text style={styles.badgeText}>Trusted by 5000+ Students</Text>
                </View>
            </View>

            <Text style={styles.headline}>
                Find Your Perfect{'\n'}
                <Text style={styles.headlineAccent}>Student Accommodation</Text>
            </Text>
            <Text style={styles.subheadline}>
                Book verified hostels near top Sri Lankan universities.{'\n'}Safe, affordable, and hassle-free.
            </Text>

            {/* Floating Search Card */}
            <View style={[styles.searchBox, { zIndex: 100 }]}>
                <View style={styles.searchRow}>
                    {/* University */}
                    <View style={[styles.inputGroup, { zIndex: activeDropdown === 'uni' ? 10 : 1 }]}>
                        <Text style={styles.label}>University</Text>
                        <TouchableOpacity style={styles.pickerBox} onPress={() => toggleDropdown('uni')} activeOpacity={0.8}>
                            <Ionicons name="school-outline" size={16} color="#EF475D" style={{ marginRight: 8 }} />
                            <Text style={university ? styles.inputText : styles.placeholderText}>{university || 'Select University'}</Text>
                            <Ionicons name="chevron-down" size={14} color="#999" />
                        </TouchableOpacity>
                        {activeDropdown === 'uni' && (
                            <View style={styles.dropdownList}>
                                <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                                    {universities.map((uni, idx) => (
                                        <TouchableOpacity key={idx} style={styles.dropdownItem} onPress={() => selectOption(setUniversity, uni)}>
                                            <Text style={styles.dropdownText}>{uni}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    {/* Date */}
                    <View style={[styles.inputGroup, { zIndex: activeDropdown === 'date' ? 10 : 1 }]}>
                        <Text style={styles.label}>Move-in Date</Text>
                        <TouchableOpacity style={styles.pickerBox} onPress={() => toggleDropdown('date')} activeOpacity={0.8}>
                            <Ionicons name="calendar-outline" size={16} color="#EF475D" style={{ marginRight: 8 }} />
                            <Text style={styles.inputText}>{moveInDate}</Text>
                            <Ionicons name="chevron-down" size={14} color="#999" />
                        </TouchableOpacity>
                        {activeDropdown === 'date' && (
                            <View style={[styles.dropdownList, { padding: 12, width: 280 }]}>
                                {renderCalendar()}
                            </View>
                        )}
                    </View>

                    {/* Budget */}
                    <View style={[styles.inputGroup, { zIndex: activeDropdown === 'budget' ? 10 : 1 }]}>
                        <Text style={styles.label}>Budget (monthly)</Text>
                        <TouchableOpacity style={styles.pickerBox} onPress={() => toggleDropdown('budget')} activeOpacity={0.8}>
                            <Ionicons name="wallet-outline" size={16} color="#EF475D" style={{ marginRight: 8 }} />
                            <Text style={budget ? styles.inputText : styles.placeholderText}>{budget || 'Any Budget'}</Text>
                            <Ionicons name="chevron-down" size={14} color="#999" />
                        </TouchableOpacity>
                        {activeDropdown === 'budget' && (
                            <View style={styles.dropdownList}>
                                {budgetRanges.map((item, idx) => (
                                    <TouchableOpacity key={idx} style={styles.dropdownItem} onPress={() => selectOption(setBudget, item)}>
                                        <Text style={styles.dropdownText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Room Type */}
                    <View style={[styles.inputGroup, { zIndex: activeDropdown === 'room' ? 10 : 1 }]}>
                        <Text style={styles.label}>Room Type</Text>
                        <TouchableOpacity style={styles.pickerBox} onPress={() => toggleDropdown('room')} activeOpacity={0.8}>
                            <Ionicons name="bed-outline" size={16} color="#EF475D" style={{ marginRight: 8 }} />
                            <Text style={roomType ? styles.inputText : styles.placeholderText}>{roomType || 'Any Room Type'}</Text>
                            <Ionicons name="chevron-down" size={14} color="#999" />
                        </TouchableOpacity>
                        {activeDropdown === 'room' && (
                            <View style={styles.dropdownList}>
                                {roomTypes.map((item, idx) => (
                                    <TouchableOpacity key={idx} style={styles.dropdownItem} onPress={() => selectOption(setRoomType, item)}>
                                        <Text style={styles.dropdownText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                <TouchableOpacity style={styles.searchButton} activeOpacity={0.85}>
                    <Ionicons name="search" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.searchButtonText}>Search Hostels</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingBottom: 80,
        paddingHorizontal: 20,
        backgroundColor: '#FAFBFC',
        alignItems: 'center',
    },
    trustBadges: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 28,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    badgeText: {
        fontSize: 13,
        color: '#555',
        fontWeight: '500',
    },
    headline: {
        fontSize: isWeb ? 44 : 28,
        fontWeight: '800',
        textAlign: 'center',
        color: '#1A1A1A',
        maxWidth: 700,
        marginBottom: 16,
        lineHeight: isWeb ? 54 : 36,
        letterSpacing: -0.5,
    },
    headlineAccent: {
        color: '#EF475D',
    },
    subheadline: {
        fontSize: isWeb ? 18 : 15,
        color: '#717171',
        textAlign: 'center',
        maxWidth: 500,
        marginBottom: 48,
        lineHeight: 28,
    },
    searchBox: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 28,
        width: '100%',
        maxWidth: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 30,
        elevation: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    searchRow: {
        flexDirection: isWeb ? 'row' : 'column',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 20,
        zIndex: 10,
    },
    inputGroup: {
        flex: 1,
        position: 'relative',
    },
    label: {
        fontSize: 12,
        color: '#999',
        marginBottom: 6,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    pickerBox: {
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        height: 48,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputText: {
        fontSize: 14,
        color: '#1A1A1A',
        flex: 1,
        fontWeight: '500',
    },
    placeholderText: {
        fontSize: 14,
        color: '#AAA',
        flex: 1,
    },
    dropdownList: {
        position: 'absolute',
        top: 76,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 8,
        zIndex: 1000,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    dropdownText: {
        color: '#333',
        fontSize: 14,
    },
    calendarContainer: { backgroundColor: '#fff' },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    calendarTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
    daysGrid: { width: '100%' },
    weekRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 5 },
    weekDayText: { fontSize: 11, color: '#999', width: 30, textAlign: 'center', fontWeight: '600' },
    daysRow: { flexDirection: 'row', flexWrap: 'wrap' },
    dayCell: { width: '14.28%', height: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
    selectedDayCell: { backgroundColor: '#EF475D', borderRadius: 16 },
    dayText: { fontSize: 13, color: '#333' },
    selectedDayText: { color: '#fff', fontWeight: 'bold' },
    searchButton: {
        backgroundColor: '#EF475D',
        paddingVertical: 16,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
