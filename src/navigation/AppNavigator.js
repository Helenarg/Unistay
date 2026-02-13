import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import StudentHomeScreen from '../screens/StudentHomeScreen';
import LandlordHomeScreen from '../screens/LandlordHomeScreen';
import FindHostelsScreen from '../screens/student/FindHostelsScreen';
import StudentVerificationScreen from '../screens/student/StudentVerificationScreen';
import UniversitySelectionScreen from '../screens/student/UniversitySelectionScreen';
import LandlordVerificationScreen from '../screens/landlord/LandlordVerificationScreen';
import CreateListingScreen from '../screens/landlord/CreateListingScreen';
import FAQScreen from '../screens/FAQScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
            <Stack.Screen name="LandlordHome" component={LandlordHomeScreen} />
            <Stack.Screen name="FindHostels" component={FindHostelsScreen} />
            <Stack.Screen name="FAQ" component={FAQScreen} options={{ headerShown: true, title: 'FAQ' }} />

            <Stack.Screen name="StudentVerification" component={StudentVerificationScreen} options={{ headerShown: true, title: 'Verification' }} />
            <Stack.Screen name="UniversitySelection" component={UniversitySelectionScreen} options={{ headerShown: true, title: 'Select University' }} />

            <Stack.Screen name="LandlordVerification" component={LandlordVerificationScreen} options={{ headerShown: true, title: 'Verification' }} />
            <Stack.Screen name="CreateListing" component={CreateListingScreen} options={{ headerShown: true, title: 'Create Listing' }} />
        </Stack.Navigator>
    );
}
