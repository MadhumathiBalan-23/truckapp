import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useTruckStore } from '../../store/truckStore';
import { COLORS, SPACING, SHADOWS, COMMON_STYLES } from '../../utils/theme';
import { Header } from '../../components/Header';
import { TruckCard } from '../../components/TruckCard';

type AuditingTabType = 'PENDING' | 'AUDITED';

export const TruckApprovalScreen: React.FC = () => {
  const trucks = useTruckStore((state) => state.trucks);
  const updateTruckStatus = useTruckStore((state) => state.updateTruckStatus);

  const [activeTab, setActiveTab] = useState<AuditingTabType>('PENDING');

  const getFilteredTrucks = () => {
    if (activeTab === 'PENDING') {
      return trucks.filter((t) => t.status === 'PENDING');
    } else {
      return trucks.filter((t) => t.status !== 'PENDING');
    }
  };

  const handleApprove = (truckId: string, truckNo: string) => {
    updateTruckStatus(truckId, 'APPROVED');
    Alert.alert('Approve Complete', `Vehicle ${truckNo} has been verified and approved.`);
  };

  const handleReject = (truckId: string, truckNo: string) => {
    updateTruckStatus(truckId, 'REJECTED');
    Alert.alert('Reject Complete', `Vehicle ${truckNo} has been rejected.`);
  };

  return (
    <SafeAreaView style={COMMON_STYLES.safeArea}>
      <Header title="Fleet Auditor" />

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'PENDING' ? styles.tabActive : null]}
          onPress={() => setActiveTab('PENDING')}
        >
          <Text style={[styles.tabTxt, activeTab === 'PENDING' ? styles.tabTxtActive : null]}>
            Pending Approvals ({trucks.filter((t) => t.status === 'PENDING').length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'AUDITED' ? styles.tabActive : null]}
          onPress={() => setActiveTab('AUDITED')}
        >
          <Text style={[styles.tabTxt, activeTab === 'AUDITED' ? styles.tabTxtActive : null]}>
            Audited Registry ({trucks.filter((t) => t.status !== 'PENDING').length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getFilteredTrucks()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <TruckCard truck={item} />
            
            {item.status === 'PENDING' && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.rejectBtn]}
                  onPress={() => handleReject(item.id, item.truckNumber)}
                >
                  <Text style={styles.rejectTxt}>⛔ REJECT</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.approveBtn]}
                  onPress={() => handleApprove(item.id, item.truckNumber)}
                >
                  <Text style={styles.approveTxt}>✅ VERIFY & APPROVE</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={styles.emptyEmoji}>🚛</Text>
            <Text style={styles.emptyTitle}>Queue is empty</Text>
            <Text style={styles.emptySub}>No truck registration requests match this status criteria.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabTxt: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tabTxtActive: {
    color: COLORS.primary,
  },
  listContainer: {
    padding: SPACING.lg,
  },
  cardWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xs,
    marginBottom: SPACING.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.xs,
  },
  actionBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  rejectBtn: {
    backgroundColor: COLORS.dangerLight,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
  },
  approveBtn: {
    backgroundColor: COLORS.primary,
  },
  rejectTxt: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: '800',
  },
  approveTxt: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },
  emptyView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
});
