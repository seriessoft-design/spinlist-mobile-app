/**
 * List Detail Screen
 * Manage items in a list (add, edit, complete, delete)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ListItem } from '../types';
import { COLORS } from '../constants/config';
import {
  getList,
  addListItem,
  updateListItem,
  deleteListItem,
  renewList,
} from '../services/firebase';
import { formatTimeRemaining, calculatePercentage } from '../utils/helpers';

type ListDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ListDetail'
>;
type ListDetailScreenRouteProp = RouteProp<RootStackParamList, 'ListDetail'>;

interface Props {
  navigation: ListDetailScreenNavigationProp;
  route: ListDetailScreenRouteProp;
}

const ListDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { listId } = route.params;
  const [list, setList] = useState<any>(null);
  const [newItemText, setNewItemText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadList();
  }, [listId]);

  const loadList = async () => {
    try {
      const listData = await getList(listId);
      setList(listData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load list');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItemText.trim()) return;

    try {
      await addListItem(listId, newItemText.trim());
      setNewItemText('');
      await loadList();
    } catch (error) {
      Alert.alert('Error', 'Failed to add item');
    }
  };

  const handleToggleComplete = async (item: ListItem) => {
    try {
      await updateListItem(listId, item.id, { completed: !item.completed });
      await loadList();
    } catch (error) {
      Alert.alert('Error', 'Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteListItem(listId, itemId);
      await loadList();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  const handleRenewList = async () => {
    Alert.alert(
      'Renew List',
      'This will extend the deletion timer by 48 hours. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Renew',
          onPress: async () => {
            try {
              await renewList(listId);
              await loadList();
              Alert.alert('Success', 'List renewed for 48 more hours!');
            } catch (error) {
              Alert.alert('Error', 'Failed to renew list');
            }
          },
        },
      ]
    );
  };

  if (loading || !list) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const completedCount = list.items.filter((item: ListItem) => item.completed).length;
  const totalCount = list.items.length;
  const progress = calculatePercentage(completedCount, totalCount);
  const timeRemaining = formatTimeRemaining(list.deleteAt);

  const renderItem = ({ item }: { item: ListItem }) => (
    <View style={styles.itemRow}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => handleToggleComplete(item)}
      >
        <Text style={styles.checkboxIcon}>
          {item.completed ? '✅' : '⬜'}
        </Text>
      </TouchableOpacity>
      <Text
        style={[
          styles.itemText,
          item.completed && styles.itemTextCompleted,
        ]}
      >
        {item.text}
      </Text>
      <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{list.title}</Text>
        <TouchableOpacity style={styles.renewButton} onPress={handleRenewList}>
          <Text style={styles.renewIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.statsText}>
          {completedCount}/{totalCount} completed • ⏰ {timeRemaining}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new item..."
          value={newItemText}
          onChangeText={setNewItemText}
          onSubmitEditing={handleAddItem}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={list.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items yet. Add one above!</Text>
          </View>
        }
      />
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
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 12,
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.primary,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  renewButton: {
    padding: 8,
  },
  renewIcon: {
    fontSize: 24,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  statsText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxIcon: {
    fontSize: 24,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
  deleteIcon: {
    fontSize: 20,
    marginLeft: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default ListDetailScreen;
