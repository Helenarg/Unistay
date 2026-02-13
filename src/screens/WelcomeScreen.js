import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import WebNavbar from '../components/WebNavbar';
import HeroSection from '../components/HeroSection';
import WebFooter from '../components/WebFooter';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 768;

export default function WelcomeScreen({ navigation }) {

  // Fallback for Mobile (The original centered simple screen) if on tiny screen
  // But user asked for the "Web Page like this", so I'll try to render the full version responsively.

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={true}
      >
        <WebNavbar navigation={navigation} />
        <HeroSection />

        {/* --- FEATURES SECTION --- */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Why Choose UniStay.lk?</Text>
          <View style={styles.grid}>
            <FeatureCard
              icon="🛡️"
              title="Verified Hostels"
              desc="All properties are physically inspected and verified for safety and quality"
            />
            <FeatureCard
              icon="💳"
              title="Pay Rent Online / Escrow"
              desc="Secure payments held in escrow until check-in is confirmed"
            />
            <FeatureCard
              icon="👥"
              title="Roommate Matching"
              desc="AI-powered matching to find compatible roommates with similar interests"
            />
            <FeatureCard
              icon="⭐"
              title="Trusted Reviews + Photos"
              desc="Real reviews and photos from verified students who stayed there"
            />
          </View>
        </View>

        {/* --- UNIVERSITIES SECTION --- */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Universities We Support</Text>
          <View style={styles.uniRow}>
            <UniItem name="UoC" icon="🎓" />
            <UniItem name="UoM" icon="🏛️" />
            <UniItem name="UoP" icon="📚" />
            <UniItem name="UoK" icon="🎯" />
            <UniItem name="UoR" icon="🌟" />
            <UniItem name="USJ" icon="🏫" />
          </View>
        </View>

        {/* --- POPULAR HOSTELS PLACEHOLDER --- */}
        <View style={styles.section}>
          <View style={styles.rowHeader}>
            <Text style={styles.sectionTitleAlignLeft}>Popular Student Hostels</Text>
            <TouchableOpacity style={styles.viewAllBtn}><Text style={styles.viewAllText}>View All →</Text></TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {/* Mock Hostel Cards */}
            <HostelCard title="Green Valley Student Residence" loc="Nugegoda" price="Rs. 15,000" rating="4.8" />
            <HostelCard title="Campus View Boarding" loc="Katubedda" price="Rs. 18,000" rating="4.9" />
            <HostelCard title="Student Haven" loc="Peradeniya" price="Rs. 10,000" rating="4.5" />
          </View>
        </View>

        {/* --- LANDLORD CTA --- */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Are You a Landlord?</Text>
          <Text style={styles.ctaDesc}>List your hostel on UniStay.lk and reach thousands of students. Free listing for a limited time!</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.ctaButtonText}>List Your Hostel — Free →</Text>
          </TouchableOpacity>
        </View>

        <WebFooter />
      </ScrollView >
    </View >
  );
}

// --- SUB COMPONENTS (Internal for simplicity, can move later) ---

function FeatureCard({ icon, title, desc }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Text style={{ fontSize: 24 }}>{icon}</Text>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </View>
  );
}

function UniItem({ name, icon }) {
  return (
    <View style={styles.uniItem}>
      <Text style={{ fontSize: 30, marginBottom: 10 }}>{icon}</Text>
      <Text style={{ fontWeight: '600', color: '#555' }}>{name}</Text>
    </View>
  );
}

function HostelCard({ title, loc, price, rating }) {
  return (
    <View style={styles.hostelCard}>
      <View style={styles.hostelImage} />
      <View style={styles.hostelContent}>
        <View style={styles.badge}><Text style={styles.badgeText}>Verified</Text></View>
        <Text style={styles.hostelTitle}>{title}</Text>
        <Text style={styles.hostelLoc}>📍 {loc}</Text>
        <View style={styles.hostelFooter}>
          <Text style={styles.hostelPrice}>{price} <Text style={{ fontSize: 12, fontWeight: 'normal' }}>/ month</Text></Text>
          <View style={styles.ratingBadge}><Text style={{ color: '#fff' }}>★ {rating}</Text></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height: Platform.OS === 'web' ? '100vh' : '100%',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  section: {
    paddingVertical: 60,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 1200,
    marginBottom: 30,
    alignItems: 'center',
  },
  sectionTitleAlignLeft: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllBtn: {
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  viewAllText: { color: '#007AFF' },
  grid: {
    flexDirection: isWeb ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 30,
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    width: isWeb ? 280 : '100%',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0f2f1', // Light teal
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  cardDesc: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
    fontSize: 14,
  },
  uniRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 30,
  },
  uniItem: {
    width: 150,
    height: 120,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
  },
  hostelCard: {
    width: isWeb ? 350 : '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  hostelImage: {
    height: 200,
    backgroundColor: '#ddd',
  },
  hostelContent: { padding: 20 },
  hostelTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  hostelLoc: { color: '#666', fontSize: 14, marginBottom: 15 },
  hostelFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hostelPrice: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 },
  badge: { position: 'absolute', top: -180, right: 20, backgroundColor: '#00c853', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  ratingBadge: { backgroundColor: '#e3f2fd', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, backgroundColor: '#4285F4' },

  ctaSection: {
    backgroundColor: '#00cba9', // Gradient direction in css but using solid here roughly matching
    width: '90%',
    maxWidth: 1200,
    alignSelf: 'center',
    borderRadius: 20,
    padding: 60,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
    // Creating a gradient check feel with a simple background for now
    backgroundColor: '#17a2b8',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  ctaDesc: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: 600,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  ctaButtonText: {
    color: '#17a2b8',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
