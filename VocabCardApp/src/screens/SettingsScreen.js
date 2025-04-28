import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { ThemeContext } from '../context/ThemeContext';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BACKGROUND_FETCH_TASK = 'background-fetch-task';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();
  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

const SettingsScreen = () => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [interval, setInterval] = useState(30);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('settings');
      if (settings) {
        const { notificationsEnabled: savedNotifications, interval: savedInterval } = JSON.parse(settings);
        setNotificationsEnabled(savedNotifications);
        setInterval(savedInterval);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleNotifications = async (value) => {
    try {
      if (value) {
        await registerBackgroundFetchAsync();
      } else {
        await unregisterBackgroundFetchAsync();
      }
      setNotificationsEnabled(value);
      saveSettings({ notificationsEnabled: value, interval });
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const updateInterval = async (newInterval) => {
    try {
      setInterval(newInterval);
      saveSettings({ notificationsEnabled, interval: newInterval });
  
      if (notificationsEnabled) {
        await unregisterBackgroundFetchAsync();
        await registerBackgroundFetchAsync();
      }
    } catch (error) {
      console.error('Error updating interval:', error);
      Alert.alert('Error', 'Failed to update reminder interval');
    }
  };
  
  const registerBackgroundFetchAsync = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: interval * 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    } catch (error) {
      console.error('Error registering background fetch:', error);
    }
  };

  const unregisterBackgroundFetchAsync = async () => {
    try {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    } catch (error) {
      console.error('Error unregistering background fetch:', error);
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
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Enable Reminders</Text>
              <Text style={styles.settingDescription}>Get periodic reminders to review your vocabulary</Text>
            </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
              trackColor={{ false: '#767577', true: '#4a90e2' }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Frequency</Text>
            <View style={styles.intervalButtons}>
            {[15, 30, 60, 120].map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.intervalButton,
                  interval === minutes && styles.intervalButtonActive
                  ]}
                  onPress={() => updateInterval(minutes)}
                >
                <Text style={[
                  styles.intervalButtonText,
                  interval === minutes && styles.intervalButtonTextActive
                ]}>
                    {minutes} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  intervalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  intervalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  intervalButtonActive: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  intervalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  intervalButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SettingsScreen; 