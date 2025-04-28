import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AddCardScreen = () => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');

  const handleAddCard = async () => {
    if (!word.trim() || !meaning.trim()) {
      Alert.alert('Error', 'Please fill in both word and meaning');
      return;
    }

    try {
      const newCard = {
        id: Date.now().toString(),
        word: word.trim(),
        meaning: meaning.trim(),
        example: example.trim(),
      };

      const existingCards = await AsyncStorage.getItem('vocabCards');
      const cards = existingCards ? JSON.parse(existingCards) : [];
      cards.push(newCard);
      await AsyncStorage.setItem('vocabCards', JSON.stringify(cards));
      
      Alert.alert('Success', 'Card added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add card');
    }
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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Add New Card</Text>
      </View>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Word</Text>
        <TextInput
            style={[styles.input, { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }]}
            placeholder="Enter word"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={word}
          onChangeText={setWord}
        />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Meaning</Text>
        <TextInput
            style={[styles.input, { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }]}
            placeholder="Enter meaning"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={meaning}
          onChangeText={setMeaning}
          multiline
        />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Example (Optional)</Text>
        <TextInput
            style={[styles.input, { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }]}
            placeholder="Enter example sentence"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={example}
          onChangeText={setExample}
          multiline
        />
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddCard}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Card</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default AddCardScreen; 