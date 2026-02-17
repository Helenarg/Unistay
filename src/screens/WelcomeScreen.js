import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebNavbar from '../components/WebNavbar';
import HeroSection from '../components/HeroSection';
import WebFooter from '../components/WebFooter';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web' && width > 768;

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} style={{ flex: 1 }} showsVerticalScrollIndicator={true}>
        <WebNavbar navigation={navigation} />
        <HeroSection />

        {/* --- WHY UNISTAY SECTION --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTag}>WHY UNISTAY</Text>
          <Text style={styles.sectionHeader}>Everything You Need,{'\n'}All in One Place</Text>
          <View style={styles.grid}>
            <FeatureCard icon="shield-checkmark" color="#27AE60" title="Verified Properties" desc="Every property is physically verified for safety, cleanliness, and quality standards" />
            <FeatureCard icon="card" color="#EF475D" title="Secure Payments" desc="Pay rent securely online with escrow protection until check-in is confirmed" />
            <FeatureCard icon="people" color="#3498DB" title="Roommate Matching" desc="Find compatible roommates with our smart matching based on lifestyle preferences" />
            <FeatureCard icon="star" color="#F39C12" title="Real Reviews" desc="Read authentic reviews and photos from verified students who stayed there" />
          </View>
        </View>

        {/* --- UNIVERSITIES SECTION --- */}
        <View style={[styles.section, { backgroundColor: '#F7F8FA' }]}>
          <Text style={styles.sectionTag}>PARTNER UNIVERSITIES</Text>
          <Text style={styles.sectionHeader}>Find Hostels Near Your University</Text>
          <View style={styles.uniGrid}>
            <UniCard name="University of Colombo" abbr="UoC" color="#1A1A2E" logo="https://science.cmb.ac.lk/wp-content/uploads/2024/03/Untitled_design-removebg-preview.png" onPress={() => navigation.navigate('FindHostels')} />
            <UniCard name="University of Moratuwa" abbr="UoM" color="#2C3E50" logo="https://upload.wikimedia.org/wikipedia/en/6/60/University_of_Moratuwa_logo.png" onPress={() => navigation.navigate('FindHostels')} />
            <UniCard name="University of Peradeniya" abbr="UoP" color="#34495E" logo="https://upload.wikimedia.org/wikipedia/commons/a/ac/University_of_Peradeniya_Crest.svg" onPress={() => navigation.navigate('FindHostels')} />
            <UniCard name="University of Kelaniya" abbr="UoK" color="#1A1A2E" logo="https://upload.wikimedia.org/wikipedia/en/e/e0/Kelaniya.png" onPress={() => navigation.navigate('FindHostels')} />
            <UniCard name="University of Ruhuna" abbr="UoR" color="#2C3E50" logo="https://upload.wikimedia.org/wikipedia/en/2/2e/University_of_Ruhuna_logo.png" onPress={() => navigation.navigate('FindHostels')} />
            <UniCard name="University of Sri Jayewardenepura" abbr="USJ" color="#34495E" logo="https://upload.wikimedia.org/wikipedia/en/1/1f/University_of_Sri_Jayewardenepura_crest.png" onPress={() => navigation.navigate('FindHostels')} />
          </View>
        </View>

        {/* --- POPULAR HOSTELS --- */}
        <View style={styles.section}>
          <View style={styles.rowHeader}>
            <View>
              <Text style={styles.sectionTag}>TRENDING NOW</Text>
              <Text style={styles.sectionHeaderLeft}>Popular Student Hostels</Text>
            </View>
            <TouchableOpacity style={styles.viewAllBtn} onPress={() => navigation.navigate('FindHostels')}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="arrow-forward" size={14} color="#EF475D" />
            </TouchableOpacity>
          </View>
          <View style={styles.hostelGrid}>
            <HostelCard title="Green Valley Student Residence" loc="Nugegoda" price="Rs. 15,000" rating="4.8" tags={['WiFi', 'Meals', 'AC']} />
            <HostelCard title="Campus View Boarding" loc="Katubedda" price="Rs. 18,000" rating="4.9" tags={['WiFi', 'Laundry', 'Study Room']} />
            <HostelCard title="Student Haven" loc="Peradeniya" price="Rs. 10,000" rating="4.5" tags={['WiFi', 'Parking']} />
          </View>
        </View>

        {/* --- HOW IT WORKS --- */}
        <View style={[styles.section, { backgroundColor: '#F7F8FA' }]}>
          <Text style={styles.sectionTag}>HOW IT WORKS</Text>
          <Text style={styles.sectionHeader}>Book in 3 Simple Steps</Text>
          <View style={styles.stepsRow}>
            <StepCard number="1" icon="search" title="Search" desc="Browse verified hostels near your university" />
            <View style={styles.stepConnector}><Ionicons name="arrow-forward" size={20} color="#E8E8E8" /></View>
            <StepCard number="2" icon="checkmark-circle" title="Book" desc="Select your room and book instantly online" />
            <View style={styles.stepConnector}><Ionicons name="arrow-forward" size={20} color="#E8E8E8" /></View>
            <StepCard number="3" icon="home" title="Move In" desc="Complete payment and move into your new home" />
          </View>
        </View>

        {/* --- STATS --- */}
        <View style={styles.statsSection}>
          <StatItem number="5,000+" label="Happy Students" />
          <View style={styles.statDivider} />
          <StatItem number="500+" label="Verified Properties" />
          <View style={styles.statDivider} />
          <StatItem number="6" label="Universities" />
          <View style={styles.statDivider} />
          <StatItem number="24/7" label="Support" />
        </View>

        {/* --- LANDLORD CTA --- */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaContent}>
            <View style={styles.ctaLeft}>
              <Text style={styles.ctaTag}>FOR PROPERTY OWNERS</Text>
              <Text style={styles.ctaTitle}>List Your Property{'\n'}With UniStay</Text>
              <Text style={styles.ctaDesc}>Reach thousands of verified students looking for accommodation. Free listing for a limited time.</Text>
              <View style={styles.ctaButtons}>
                <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.ctaButtonText}>List Your Property</Text>
                  <Ionicons name="arrow-forward" size={16} color="#EF475D" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.ctaSecondary}>
                  <Text style={styles.ctaSecondaryText}>Learn More</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.ctaRight}>
              <View style={styles.ctaIconBlock}>
                <Ionicons name="business" size={48} color="#EF475D" />
              </View>
            </View>
          </View>
        </View>

        <WebFooter />
      </ScrollView>
    </View>
  );
}

// --- SUB COMPONENTS ---

function FeatureCard({ icon, color, title, desc }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{desc}</Text>
    </View>
  );
}

function UniCard({ name, abbr, color, logo, onPress }) {
  const [error, setError] = React.useState(false);

  return (
    <TouchableOpacity style={styles.uniCard} onPress={onPress}>
      <View style={[styles.uniAvatar, { backgroundColor: logo && !error ? '#fff' : color }, logo && !error && { borderWidth: 1, borderColor: '#eee' }]}>
        {logo && !error ? (
          <Image
            source={{ uri: logo }}
            style={{ width: '70%', height: '70%' }}
            resizeMode="contain"
            onError={() => setError(true)}
          />
        ) : (
          <Text style={styles.uniAbbr}>{abbr}</Text>
        )}
      </View>
      <Text style={styles.uniName}>{name}</Text>
      <View style={styles.uniArrow}>
        <Ionicons name="arrow-forward" size={14} color="#EF475D" />
      </View>
    </TouchableOpacity>
  );
}

function HostelCard({ title, loc, price, rating, tags }) {
  return (
    <View style={styles.hostelCard}>
      <View style={styles.hostelImage}>
        <View style={styles.hostelImagePlaceholder}>
          <Ionicons name="image-outline" size={32} color="#ccc" />
        </View>
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={10} color="#fff" />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>
      <View style={styles.hostelContent}>
        <Text style={styles.hostelTitle}>{title}</Text>
        <View style={styles.hostelLocRow}>
          <Ionicons name="location-outline" size={14} color="#717171" />
          <Text style={styles.hostelLoc}>{loc}</Text>
        </View>
        <View style={styles.tagRow}>
          {(tags || []).map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.hostelFooter}>
          <Text style={styles.hostelPrice}>{price}<Text style={styles.priceUnit}>/mo</Text></Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#F39C12" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.enquireBtn}>
          <Text style={styles.enquireBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StepCard({ number, icon, title, desc }) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{number}</Text></View>
      <View style={styles.stepIconCircle}>
        <Ionicons name={icon} size={28} color="#EF475D" />
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDesc}>{desc}</Text>
    </View>
  );
}

function StatItem({ number, label }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}),
  },
  scrollContent: { paddingBottom: 0 },
  section: {
    paddingVertical: 70,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  sectionTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF475D',
    letterSpacing: 2,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  sectionHeader: {
    fontSize: isWeb ? 32 : 24,
    fontWeight: '800',
    marginBottom: 40,
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  sectionHeaderLeft: {
    fontSize: isWeb ? 28 : 22,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 1100,
    marginBottom: 30,
    alignItems: 'flex-end',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#EF475D',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 25,
  },
  viewAllText: { color: '#EF475D', fontWeight: '600', fontSize: 14 },

  // Feature Cards
  grid: {
    flexDirection: isWeb ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    width: '100%',
    maxWidth: 1100,
  },
  card: {
    backgroundColor: '#fff',
    width: isWeb ? 240 : '100%',
    padding: 28,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  cardDesc: {
    textAlign: 'center',
    color: '#717171',
    lineHeight: 20,
    fontSize: 13,
  },

  // University Cards
  uniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    maxWidth: 1100,
  },
  uniCard: {
    width: isWeb ? 320 : '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 14,
  },
  uniAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uniAbbr: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  uniName: {
    flex: 1,
    fontWeight: '600',
    color: '#1A1A1A',
    fontSize: 14,
  },
  uniArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF0F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Hostel Cards
  hostelGrid: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: 24,
    width: '100%',
    maxWidth: 1100,
    justifyContent: 'center',
  },
  hostelCard: {
    width: isWeb ? 340 : '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  hostelImage: {
    height: 180,
    backgroundColor: '#F7F8FA',
    position: 'relative',
  },
  hostelImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#27AE60',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  hostelContent: { padding: 18 },
  hostelTitle: { fontWeight: '700', fontSize: 16, color: '#1A1A1A', marginBottom: 6 },
  hostelLocRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  hostelLoc: { color: '#717171', fontSize: 13 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  tag: {
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  tagText: { fontSize: 11, color: '#717171', fontWeight: '500' },
  hostelFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  hostelPrice: { color: '#EF475D', fontWeight: '800', fontSize: 18 },
  priceUnit: { fontSize: 13, fontWeight: '500', color: '#999' },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#F39C12' },
  enquireBtn: {
    backgroundColor: '#EF475D',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  enquireBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Steps
  stepsRow: {
    flexDirection: isWeb ? 'row' : 'column',
    alignItems: 'center',
    gap: isWeb ? 0 : 20,
    maxWidth: 900,
  },
  stepCard: {
    alignItems: 'center',
    width: isWeb ? 220 : '100%',
    padding: 20,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF475D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  stepNumberText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  stepIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF0F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: { fontWeight: '700', fontSize: 18, color: '#1A1A1A', marginBottom: 6 },
  stepDesc: { textAlign: 'center', color: '#717171', fontSize: 13, lineHeight: 20 },
  stepConnector: { marginHorizontal: isWeb ? 20 : 0 },

  // Stats
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 40,
    gap: isWeb ? 60 : 20,
    flexWrap: 'wrap',
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: isWeb ? 36 : 28, fontWeight: '800', color: '#EF475D' },
  statLabel: { fontSize: 14, color: '#717171', marginTop: 4, fontWeight: '500' },
  statDivider: { width: 1, height: 50, backgroundColor: '#E8E8E8' },

  // CTA
  ctaSection: {
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  ctaContent: {
    backgroundColor: '#1A1A2E',
    borderRadius: 24,
    padding: isWeb ? 60 : 30,
    flexDirection: isWeb ? 'row' : 'column',
    alignItems: 'center',
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  ctaLeft: { flex: 1 },
  ctaRight: { alignItems: 'center', justifyContent: 'center', marginTop: isWeb ? 0 : 24 },
  ctaTag: { fontSize: 12, fontWeight: '700', color: '#EF475D', letterSpacing: 2, marginBottom: 12 },
  ctaTitle: { fontSize: isWeb ? 32 : 24, fontWeight: '800', color: '#fff', marginBottom: 16, lineHeight: isWeb ? 42 : 32 },
  ctaDesc: { color: '#8B8BA3', fontSize: 16, marginBottom: 28, lineHeight: 26, maxWidth: 450 },
  ctaButtons: { flexDirection: 'row', gap: 12 },
  ctaButton: {
    backgroundColor: '#EF475D',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ctaButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  ctaSecondary: {
    borderWidth: 1.5,
    borderColor: '#2D2D4A',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  ctaSecondaryText: { color: '#8B8BA3', fontWeight: '600', fontSize: 15 },
  ctaIconBlock: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2D2D4A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
