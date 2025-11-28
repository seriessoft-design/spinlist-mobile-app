/**
 * Firebase Service
 * Handles authentication and Firestore database operations
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User, List, ListItem, Decision } from '../types';

// ===== Authentication =====

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    
    // Create user document in Firestore
    await createUserDocument(userCredential.user.uid, {
      email,
      phoneNumber: null,
      displayName: null,
      photoURL: null,
    });
    
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up with email:', error);
    throw error;
  }
};

/**
 * Sign in with phone number
 */
export const signInWithPhone = async (phoneNumber: string) => {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (error) {
    console.error('Error signing in with phone:', error);
    throw error;
  }
};

/**
 * Verify phone OTP code
 */
export const verifyPhoneOTP = async (confirmation: any, code: string) => {
  try {
    const userCredential = await confirmation.confirm(code);
    
    // Create user document if new user
    const userDoc = await firestore().collection('users').doc(userCredential.user.uid).get();
    if (!userDoc.exists) {
      await createUserDocument(userCredential.user.uid, {
        email: null,
        phoneNumber: userCredential.user.phoneNumber,
        displayName: null,
        photoURL: null,
      });
    }
    
    return userCredential.user;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

/**
 * Sign out
 */
export const signOut = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth().currentUser;
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChanged = (callback: (user: any) => void) => {
  return auth().onAuthStateChanged(callback);
};

// ===== User Management =====

/**
 * Create user document in Firestore
 */
const createUserDocument = async (
  uid: string,
  data: {
    email: string | null;
    phoneNumber: string | null;
    displayName: string | null;
    photoURL: string | null;
  }
) => {
  try {
    await firestore().collection('users').doc(uid).set({
      uid,
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
      isPro: false,
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const doc = await firestore().collection('users').doc(uid).get();
    if (doc.exists()) {
      const data = doc.data();
      return {
        uid: data?.uid,
        email: data?.email,
        phoneNumber: data?.phoneNumber,
        displayName: data?.displayName,
        photoURL: data?.photoURL,
        createdAt: data?.createdAt?.toDate(),
        isPro: data?.isPro || false,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

/**
 * Update user Pro status
 */
export const updateUserProStatus = async (uid: string, isPro: boolean) => {
  try {
    await firestore().collection('users').doc(uid).update({
      isPro,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user Pro status:', error);
    throw error;
  }
};

// ===== Lists Management =====

/**
 * Create a new list
 */
export const createList = async (userId: string, title: string): Promise<string> => {
  try {
    const now = new Date();
    const deleteAt = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours from now
    
    const docRef = await firestore().collection('lists').add({
      userId,
      title,
      items: [],
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
      deleteAt: firestore.Timestamp.fromDate(deleteAt),
      isDeleted: false,
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating list:', error);
    throw error;
  }
};

/**
 * Get all lists for a user
 */
export const getUserLists = async (userId: string): Promise<List[]> => {
  try {
    const snapshot = await firestore()
      .collection('lists')
      .where('userId', '==', userId)
      .where('isDeleted', '==', false)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        items: data.items || [],
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        deleteAt: data.deleteAt?.toDate(),
        isDeleted: data.isDeleted,
      };
    });
  } catch (error) {
    console.error('Error getting user lists:', error);
    throw error;
  }
};

/**
 * Get a single list by ID
 */
export const getList = async (listId: string): Promise<List | null> => {
  try {
    const doc = await firestore().collection('lists').doc(listId).get();
    if (doc.exists()) {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data?.userId,
        title: data?.title,
        items: data?.items || [],
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
        deleteAt: data?.deleteAt?.toDate(),
        isDeleted: data?.isDeleted,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting list:', error);
    throw error;
  }
};

/**
 * Update list title
 */
export const updateListTitle = async (listId: string, title: string) => {
  try {
    await firestore().collection('lists').doc(listId).update({
      title,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating list title:', error);
    throw error;
  }
};

/**
 * Add item to list
 */
export const addListItem = async (listId: string, text: string) => {
  try {
    const newItem: ListItem = {
      id: firestore().collection('lists').doc().id,
      text,
      completed: false,
      createdAt: new Date(),
    };
    
    await firestore().collection('lists').doc(listId).update({
      items: firestore.FieldValue.arrayUnion(newItem),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding list item:', error);
    throw error;
  }
};

/**
 * Update list item
 */
export const updateListItem = async (listId: string, itemId: string, updates: Partial<ListItem>) => {
  try {
    const list = await getList(listId);
    if (!list) return;
    
    const updatedItems = list.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    
    await firestore().collection('lists').doc(listId).update({
      items: updatedItems,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating list item:', error);
    throw error;
  }
};

/**
 * Delete list item
 */
export const deleteListItem = async (listId: string, itemId: string) => {
  try {
    const list = await getList(listId);
    if (!list) return;
    
    const updatedItems = list.items.filter(item => item.id !== itemId);
    
    await firestore().collection('lists').doc(listId).update({
      items: updatedItems,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error deleting list item:', error);
    throw error;
  }
};

/**
 * Renew list (extend deleteAt by 48 hours)
 */
export const renewList = async (listId: string) => {
  try {
    const newDeleteAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
    
    await firestore().collection('lists').doc(listId).update({
      deleteAt: firestore.Timestamp.fromDate(newDeleteAt),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error renewing list:', error);
    throw error;
  }
};

/**
 * Soft delete list
 */
export const deleteList = async (listId: string) => {
  try {
    await firestore().collection('lists').doc(listId).update({
      isDeleted: true,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error deleting list:', error);
    throw error;
  }
};

/**
 * Listen to lists changes in real-time
 */
export const listenToUserLists = (userId: string, callback: (lists: List[]) => void) => {
  return firestore()
    .collection('lists')
    .where('userId', '==', userId)
    .where('isDeleted', '==', false)
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      const lists = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          title: data.title,
          items: data.items || [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          deleteAt: data.deleteAt?.toDate(),
          isDeleted: data.isDeleted,
        };
      });
      callback(lists);
    });
};

// ===== Decisions Management (Optional - for analytics) =====

/**
 * Save decision to Firestore
 */
export const saveDecision = async (
  userId: string,
  options: string[],
  result: string
): Promise<string> => {
  try {
    const docRef = await firestore().collection('decisions').add({
      userId,
      options: options.map((text, index) => ({ id: `opt_${index}`, text })),
      result,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving decision:', error);
    throw error;
  }
};
