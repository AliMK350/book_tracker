import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '../hooks/useNotifications';
import { COLORS, PADDING, BORDER_RADIUS } from '../utils/constants';

// Composant de notification
export const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'milestone':
        return '📈';
      case 'reminder':
        return '📚';
      case 'recommendation':
        return '💡';
      case 'achievement':
        return '🏆';
      default:
        return '📬';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !notification.read && styles.unread,
      ]}
      onPress={() => onMarkAsRead(notification._id)}
    >
      <View style={styles.notificationLeft}>
        <Text style={styles.notificationIcon}>{getIcon(notification.type)}</Text>
      </View>

      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
        <Text style={styles.notificationTime}>
          {new Date(notification.createdAt).toLocaleDateString('fr-FR')}
        </Text>
      </View>

      {!notification.read && (
        <View style={styles.unreadBadge} />
      )}

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(notification._id)}
      >
        <Ionicons name="trash-outline" size={18} color={COLORS.textTertiary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// Écran de notifications
export default function NotificationsScreen() {
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔔 Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={markAllAsRead}
            style={styles.markAllBtn}
          >
            <Text style={styles.markAllText}>Marquer tout comme lue</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune notification</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PADDING.lg,
    paddingVertical: PADDING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkMedium,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  markAllBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: PADDING.md,
    paddingVertical: PADDING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  markAllText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: PADDING.lg,
    paddingVertical: PADDING.md,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.darkMedium,
    borderRadius: BORDER_RADIUS.lg,
    padding: PADDING.md,
    marginBottom: PADDING.md,
    alignItems: 'center',
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notificationLeft: {
    marginRight: PADDING.md,
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: PADDING.sm,
  },
  notificationMessage: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: PADDING.sm,
  },
  notificationTime: {
    color: COLORS.textTertiary,
    fontSize: 11,
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: PADDING.sm,
  },
  deleteBtn: {
    padding: PADDING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
