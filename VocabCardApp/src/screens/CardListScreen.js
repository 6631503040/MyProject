import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Animated, Dimensions, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CardListScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const theme = useContext(ThemeContext);
  const [cards, setCards] = useState([]);
  const scrollY = new Animated.Value(0);
  const [buttonScale] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isFocused) {
      loadCards();
    }
  }, [isFocused]);

  const loadCards = async () => {
    try {
      const storedCards = await AsyncStorage.getItem('vocabCards');
      if (storedCards) {
        setCards(JSON.parse(storedCards));
      } else {
        setCards([]);
      }
    } catch (error) {
      console.error('Error loading cards:', error);
      Alert.alert('Error', 'Failed to load vocabulary cards');
    }
  };

  const deleteCard = async (id) => {
    try {
      const updatedCards = cards.filter(card => card.id !== id);
      await AsyncStorage.setItem('vocabCards', JSON.stringify(updatedCards));
      setCards(updatedCards);
      Alert.alert('Success', 'Card deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete card');
    }
  };

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

  const renderCard = ({ item, index }) => {
    const inputRange = [-1, 0, 100 * index, 100 * (index + 2)];
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.8],
    });
    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.3],
    });

    return (
      <Animated.View 
        style={[
          styles.card, 
          { 
            transform: [{ scale }],
            opacity,
          }
        ]}
      >
        <View style={styles.cardContent}>
          <View style={styles.wordContainer}>
            <Text style={styles.word}>{item.word}</Text>
      <TouchableOpacity
              style={styles.deleteButton}
        onPress={() => deleteCard(item.id)}
      >
              <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
          <Text style={styles.meaning}>{item.meaning}</Text>
          {item.example && (
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleLabel}>Example:</Text>
              <Text style={styles.exampleText}>{item.example}</Text>
            </View>
          )}
        </View>
      </Animated.View>
  );
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>My Vocabulary</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('AddCard')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.headerButtonText}>Add Card</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Settings')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Ionicons name="settings-outline" size={20} color="#fff" />
            <Text style={styles.headerButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {cards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="book-outline" size={80} color="#fff" style={{ opacity: 0.5 }} />
          </View>
          <Text style={styles.emptyText}>No vocabulary cards yet</Text>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
              style={styles.addButton}
            onPress={() => navigation.navigate('AddCard')}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
          >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Your First Card</Text>
          </TouchableOpacity>
          </Animated.View>
        </View>
      ) : (
        <Animated.FlatList
          data={cards}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
    marginTop: 10,
  },
  headerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#4a90e2',
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIconContainer: {
    width: width * 0.4,
    height: width * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: width * 0.2,
    marginBottom: 30,
  },
  emptyText: {
    fontSize: 20,
    color: '#fff',
    marginVertical: 20,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#4a90e2',
    width: '80%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  list: {
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    marginBottom: 15,
  },
  wordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  word: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 10,
  },
  meaning: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
    lineHeight: 24,
  },
  exampleContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  exampleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  exampleText: {
    fontSize: 14,
    color: '#fff',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#4a90e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CardListScreen; 