import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const slideAnim = new Animated.Value(50);
  const loadingAnim = new Animated.Value(0);
  const buttonScale = new Animated.Value(1);

  useEffect(() => {
    // Combined animations
    Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(loadingAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to CardList after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('CardList');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const loadingScaleX = loadingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ]
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <View style={styles.logoInner}>
              <Ionicons name="book-outline" size={width * 0.15} color="#fff" />
            </View>
          </View>
        </View>

        <View style={styles.textContainer}>
        <Text style={styles.title}>Vocab Cards</Text>
        <Text style={styles.subtitle}>Your Personal Vocabulary Assistant</Text>
        </View>

        <View style={styles.loadingContainer}>
          <View style={styles.loadingTrack}>
            <Animated.View 
              style={[
                styles.loadingBar,
                { 
                  transform: [{ scaleX: loadingScaleX }],
                  transformOrigin: 'left'
                }
              ]} 
            />
          </View>
          <Text style={styles.loadingText}>Loading your vocabulary...</Text>
        </View>

        <Animated.View style={[styles.skipButtonContainer, { transform: [{ scale: buttonScale }] }]}>
          <TouchableOpacity 
            style={styles.skipButton}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => navigation.replace('CardList')}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  logoContainer: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: width * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoInner: {
    width: '70%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: width * 0.15,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: 0.3,
    lineHeight: 32,
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
  },
  loadingTrack: {
    width: width * 0.6,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  loadingBar: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  loadingText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
    letterSpacing: 0.3,
  },
  skipButtonContainer: {
    marginTop: 30,
  },
  skipButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default HomeScreen; 