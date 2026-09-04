import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { MOCK_USERS } from '../../data/mockUsers';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/common/Header';
import { UserRole } from '../../types/user';

type FilterRoleType = 'ALL' | 'CUSTOMER' | 'VENDOR' | 'DRIVER' | 'ADMIN';

export const UserManagementScreen: React.FC = () => {
  const [filterRole, setFilterRole] = useState<FilterRoleType>('ALL');

  const allUsersList = Object.values(MOCK_USERS);

  const filteredUsers = allUsersList.filter((u) => {
    if (filterRole === 'ALL') return true;
    return u.role === filterRole;
  });

  const handleAuditUser = (userName: string) => {
    Alert.alert('Audit Account', `Workspace profile reviews completed for ${userName}. Safe logs detected.`);
  };

  const renderRoleRow = (role: FilterRoleType, label: string) => {
    const isSel = filterRole === role;
    return (
      <TouchableOpacity
        key={role}
        style={[styles.roleTab, isSel ? styles.roleTabActive : null]}
        onPress={() => setFilterRole(role)}
      >
        <Text style={[styles.roleTabLabel, isSel ? styles.roleTabLabelActive : null]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="User Workspaces" onBack={() => {}} />

      {/* Role Filters */}
      <View style={styles.filterRow}>
        {renderRoleRow('ALL', 'All')}
        {renderRoleRow('CUSTOMER', 'Clients')}
        {renderRoleRow('VENDOR', 'Owners')}
        {renderRoleRow('DRIVER', 'Drivers')}
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTxt}>
                {item.role === 'CUSTOMER' ? '👤' : item.role === 'VENDOR' ? '🏢' : item.role === 'DRIVER' ? '🧑‍✈️' : '🛠️'}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={styles.userMobile}>Mobile: {item.mobile}</Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.roleLabel}>{item.role}</Text>
              <TouchableOpacity style={styles.auditBtn} onPress={() => handleAuditUser(item.name)}>
                <Text style={styles.auditTxt}>AUDIT</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyTxt}>No registered users in this role yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  roleTabActive: {
    borderBottomColor: COLORS.primary,
  },
  roleTabLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  roleTabLabelActive: {
    color: COLORS.primary,
  },
  listContainer: {
    padding: SPACING.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
    ...SHADOWS.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarTxt: {
    fontSize: 20,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  userMobile: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  auditBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: SPACING.sm,
  },
  auditTxt: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  emptyView: {
    paddingVertical: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTxt: {
    color: COLORS.textMuted,
    fontSize: 13.5,
    fontStyle: 'italic',
  },
});
