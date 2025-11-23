/**
 * List Keeper Screen
 * Shows all user lists with 48-hour auto-delete timer
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { List } from '../types';
import { COLORS, FREE_LIMITS } from '../constants/config';
import {
  listenToUserLists,
  createList,
  deleteList,
  getCurrentUser,
  getUserData,
} from '../services/firebase';
import { formatTimeRemaining } from '../utils/helpers';
import { trackActionForAd } from '../services/admob';

type ListKeeperScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MainTabs'
>;

interface Props {
  navigation: ListKeeperScreenNavigationProp;
}

const ListKeeperScreen: React.FC<Props> = ({ navigation }) => {
  const [lists, setLists] = useState<List[]>([]);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) return;

    // Get user Pro status
    getUserData(user.uid).then(userData => {
      setIsPro(userData?.isPro || false);
    });

    // Listen to lists changes
    const unsubscribe = listenToUserLists(user.uid, (updatedLists) => {
      setLists(updatedLists);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateList = async () => {
    const user = getCurrentUser();
    if (!user) return;

    // Check free user limits
    if (!isPro && lists.length >= FREE_LIMITS.maxLists) {
      Alert.alert(
        'Limit Reached',
        `Free users can only have ${FREE_LIMITS.maxLists} lists. Upgrade to Pro for unlimited lists!`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Upgrade',
            onPress: () => navigation.navigate('ProUpgrade'),
          },
        ]
      );
      return;
    }

    Alert.prompt(
      'New List',
      'Enter a title for your list',
      async (title) => {
        if (title && title.trim()) {
          try {
            await createList(user.uid, title.trim());
            await trackActionForAd(isPro);
          } catch (error) {
            Alert.alert('Error', 'Failed to create list');
          }
        }
      }
    );
  };

  const handleDeleteList = (listId: string, title: string) => {
    Alert.alert(
      'Delete List',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteList(listId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete list');
            }
          },
        },
      ]
    );
  };

  const renderListItem = ({ item }: { item: List }) => {
    const timeRemaining = formatTimeRemaining(item.deleteAt);
    const isExpiringSoon = item.deleteAt.getTime() - Date.now() < 6 * 60 * 60 * 1000; // < 6 hours

    return (
      <TouchableOpacity
        style={styles.listCard}
        onPress={() => navigation.navigate('ListDetail', { listId: item.id })}
      >
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{item.title}</Text>
          <TouchableOpacity
            onPress={() => handleDeleteList(item.id, item.title)}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.listItems}>
          {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
        </Text>
        <View style={styles.timerContainer}>
          <Text style={[styles.timerText, isExpiringSoon && styles.timerWarning]}>
            ⏰ Deletes in {timeRemaining}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📝</Text>
      <Text style={styles.emptyTitle}>No Lists Yet</Text>
      <Text style={styles.emptyText}>
        Create your first list to get started!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>📝 List Keeper</Text>
          <Text style={styles.subtitle}>
            {isPro
              ? 'Unlimited lists'
              : `${lists.length}/${FREE_LIMITS.maxLists} lists`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={lists}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreateList}>
        <Text style={styles.createButtonText}>+ Create List</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  settingsButton: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 28,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  listCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  deleteIcon: {
    fontSize: 20,
  },
  listItems: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  timerWarning: {
    color: COLORS.error,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ListKeeperScreen;
