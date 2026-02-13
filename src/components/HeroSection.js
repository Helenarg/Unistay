import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 768;

// Simple Calendar Helper
const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

export default function HeroSection() {
    // Search State
    const [university, setUniversity] = useState(null);
    const [moveInDate, setMoveInDate] = useState('29/01/2026'); // String format for display

    // Calendar State
    const [selectedDate, setSelectedDate] = useState(new Date(2026, 0, 29)); // Jan 29 2026
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // For navigation

    const [budget, setBudget] = useState(null);
    const [roomType, setRoomType] = useState(null);

    // Dropdown Visibility State
    const [activeDropdown, setActiveDropdown] = useState(null); // 'uni', 'budget', 'room', 'date'

    const universities = [
        'University of Colombo',
        'University of Moratuwa',
        'University of Peradeniya',
        'University of Kelaniya',
        'University of Ruhuna',
        'University of Sri Jayewardenepura'
    ];

    const budgetRanges = [
        'Any Budget',
        '< Rs. 10,000',
        'Rs. 10,000 - 20,000',
        'Rs. 20,000 - 30,000',
        '> Rs. 30,000'
    ];

    const roomTypes = [
        'Any Room Type',
        'Single Room',
        'Shared (2 Person)',
        'Shared (3 Person)',
        'Shared (4 Person)'
    ];

    const toggleDropdown = (name) => {
        if (activeDropdown === name) setActiveDropdown(null);
        else setActiveDropdown(name);
    };

    const selectOption = (setter, value) => {
        setter(value);
        setActiveDropdown(null);
    };

    // Calendar Logic
    const handleDateSelect = (day) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(newDate);
        setMoveInDate(`${String(day).padStart(2, '0')}/${String(currentMonth.getMonth() + 1).padStart(2, '0')}/${currentMonth.getFullYear()}`);
        setActiveDropdown(null);
    };

    const changeMonth = (increment) => {
        const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + increment, 1);
        setCurrentMonth(newMonth);
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const numDays = daysInMonth(month, year);
        const startDay = firstDayOfMonth(month, year); // 0 = Sun

        const days = [];
        // Empty slots for start
        for (let i = 0; i < startDay; i++) {
            days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
        }
        // Days
        for (let i = 1; i <= numDays; i++) {
            const isSelected = selectedDate.getDate() === i && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
            days.push(
                <TouchableOpacity
                    key={i}
                    style={[styles.dayCell, isSelected && styles.selectedDayCell]}
                    onPress={() => handleDateSelect(i)}
                >
                    <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>{i}</Text>
                </TouchableOpacity>
            );
        }

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return (
            <View style={styles.calendarContainer}>
                {/* Header */}
                <View style={styles.calendarHeader}>
                    <TouchableOpacity onPress={() => changeMonth(-1)}>
                        <Ionicons name="chevron-back" size={20} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.calendarTitle}>{monthNames[month]} {year}</Text>
                    <TouchableOpacity onPress={() => changeMonth(1)}>
                        <Ionicons name="chevron-forward" size={20} color="#333" />
                    </TouchableOpacity>
                </View>
                {/* Days Grid */}
                <View style={styles.daysGrid}>
                    <View style={styles.weekRow}>
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                            <Text key={i} style={styles.weekDayText}>{d}</Text>
                        ))}
                    </View>
                    <View style={styles.daysRow}>
                        {days}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headline}>
                Find Safe, Verified & Affordable Student Hostels Near Your University
            </Text>
            <Text style={styles.subheadline}>
                Sri Lanka's most trusted marketplace for university students to find, book, and pay for accommodation with complete peace of mind
            </Text>

            <View style={[styles.searchBox, { zIndex: 100 }]}>
                <View style={styles.searchRow}>

                    {/* University Dropdown */}
                    <View style={[styles.inputGroup, { zIndex: activeDropdown === 'uni' ? 10 : 1 }]}>
                        <Text style={styles.label}>University</Text>
                        <TouchableOpacity
                            style={styles.pickerBox}
                            onPress={() => toggleDropdown('uni')}
                            activeOpacity={0.8}
                        >
                            <Text style={university ? styles.inputText : styles.placeholderText}>
                                {university || 'Select University'}
                            </Text>
                            <Ionicons name="chevron-down" size={16} color="#666" />
                        </TouchableOpacity>

                        {/* Dropdown Menu */}
                        {activeDropdown === 'uni' && (
                            <View style={styles.dropdownList}>
                                <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled={true}>
                                    {universities.map((uni, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[styles.dropdownItem, idx === universities.length - 1 && styles.lastItem]}
                                            onPress={() => selectOption(setUniversity, uni)}
                                        >
                                            <Text style={styles.dropdownText}>{uni}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    {/* Move-in Date Dropdown */}
                    <View style={[styles.inputGroup, { zIndex: activeDropdown === 'date' ? 10 : 1 }]}>
                        <Text style={styles.label}>Move-in Date</Text>
                        <TouchableOpacity
                            style={styles.pickerBox}
                            onPress={() => toggleDropdown('date')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.inputText}>{moveInDate}</Text>
                            <Ionicons name="calendar-outline" size={18} color="#666" />
                        </TouchableOpacity>

                        {activeDropdown === 'date' && (
                            <View style={[styles.dropdownList, { backgroundColor: '#fff', width: 280, padding: 10 }]}>
                                {renderCalendar()}
                            </View>
                        )}
                    </View>

                    {/* Budget Dropdown */}
                    <View style={[styles.inputGroup, { zIndex: activeDropdown === 'budget' ? 10 : 1 }]}>
                        <Text style={styles.label}>Budget (monthly)</Text>
                        <TouchableOpacity
                            style={styles.pickerBox}
                            onPress={() => toggleDropdown('budget')}
                            activeOpacity={0.8}
                        >
                            <Text style={budget ? styles.inputText : styles.placeholderText}>
                                {budget || 'Any Budget'}
                            </Text>
                            <Ionicons name="chevron-down" size={16} color="#666" />
                        </TouchableOpacity>

                        {activeDropdown === 'budget' && (
                            <View style={styles.dropdownList}>
                                {budgetRanges.map((item, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={styles.dropdownItem}
                                        onPress={() => selectOption(setBudget, item)}
                                    >
                                        <Text style={styles.dropdownText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Room Type Dropdown */}
                    <View style={[styles.inputGroup, { zIndex: activeDropdown === 'room' ? 10 : 1 }]}>
                        <Text style={styles.label}>Room Type</Text>
                        <TouchableOpacity
                            style={styles.pickerBox}
                            onPress={() => toggleDropdown('room')}
                            activeOpacity={0.8}
                        >
                            <Text style={roomType ? styles.inputText : styles.placeholderText}>
                                {roomType || 'Any Room Type'}
                            </Text>
                            <Ionicons name="chevron-down" size={16} color="#666" />
                        </TouchableOpacity>

                        {activeDropdown === 'room' && (
                            <View style={styles.dropdownList}>
                                {roomTypes.map((item, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={styles.dropdownItem}
                                        onPress={() => selectOption(setRoomType, item)}
                                    >
                                        <Text style={styles.dropdownText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                <TouchableOpacity style={styles.searchButton} activeOpacity={0.9}>
                    <Ionicons name="search" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.searchButtonText}>Search Hostels</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 80,
        paddingHorizontal: 20,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
    },
    headline: {
        fontSize: isWeb ? 36 : 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        maxWidth: 800,
        marginBottom: 20,
    },
    subheadline: {
        fontSize: isWeb ? 18 : 16,
        color: '#666',
        textAlign: 'center',
        maxWidth: 700,
        marginBottom: 50,
        lineHeight: 26,
    },
    searchBox: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 25,
        width: '100%',
        maxWidth: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    searchRow: {
        flexDirection: isWeb ? 'row' : 'column',
        justifyContent: 'space-between',
        gap: 20,
        marginBottom: 25,
        zIndex: 10,
    },
    inputGroup: {
        flex: 1,
        position: 'relative',
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
        fontWeight: '600',
    },
    pickerBox: {
        backgroundColor: '#fff',
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputText: {
        fontSize: 15,
        color: '#333',
    },
    placeholderText: {
        fontSize: 15,
        color: '#8898aa',
    },

    // Dropdown Styles
    dropdownList: {
        position: 'absolute',
        top: 80, // Label height + Picket height approx
        left: 0,
        right: 0,
        backgroundColor: '#4a5568', // Dark gray for others
        borderRadius: 8,
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 1000,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#5a667a',
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    dropdownText: {
        color: '#fff',
        fontSize: 14,
    },

    // Calendar Styles
    calendarContainer: {
        backgroundColor: '#fff',
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    calendarTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    daysGrid: {
        width: '100%',
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 5,
    },
    weekDayText: {
        fontSize: 12,
        color: '#999',
        width: 30,
        textAlign: 'center',
    },
    daysRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    dayCell: {
        width: '14.28%', // 100% / 7
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    selectedDayCell: {
        backgroundColor: '#3b82f6',
        borderRadius: 15,
    },
    dayText: {
        fontSize: 13,
        color: '#333',
    },
    selectedDayText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    searchButton: {
        backgroundColor: '#3b82f6', // Bright Blue
        paddingVertical: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
