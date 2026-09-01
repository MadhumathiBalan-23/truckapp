import React from 'react';
import { View, StyleSheet, Platform, Text, useWindowDimensions } from 'react-native';
import { COLORS } from '../utils/theme';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { width } = useWindowDimensions();

  // If not web, or if in web but on a narrow viewport (like a real mobile browser),
  // render full-screen directly.
  if (Platform.OS !== 'web' || width < 480) {
    return <>{children}</>;
  }

  // Generate real status bar time
  const getTimeString = () => {
    const d = new Date();
    let hrs = d.getHours();
    const mins = String(d.getMinutes()).padStart(2, '0');
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    hrs = hrs % 12 || 12;
    return `${hrs}:${mins} ${ampm}`;
  };

  return (
    <View style={styles.webContainer}>
      {/* Device Bezel Frame */}
      <View style={styles.phoneFrame}>
        {/* Screen Notch */}
        <View style={styles.notch}>
          <View style={styles.speaker} />
          <View style={styles.camera} />
        </View>

        {/* Device Status Bar */}
        <View style={styles.statusBar}>
          <Text style={styles.statusBarTime}>{getTimeString()}</Text>
          <View style={styles.statusIcons}>
            <Text style={styles.statusTextIcon}>📶</Text>
            <Text style={styles.statusTextIcon}>🔋 100%</Text>
          </View>
        </View>

        {/* Screen Content Window */}
        <View style={styles.screenInner}>
          {children}
        </View>

        {/* Device Bottom Home Bar Indicator */}
        <View style={styles.homeIndicatorContainer}>
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#0F172A', // Slate-900 background around high-fidelity frame
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    minHeight: '100vh' as any, // Only works on web safely
  },
  phoneFrame: {
    width: 393, // standard iPhone 14/15 width
    height: 852, // standard iPhone 14/15 height
    borderRadius: 50,
    backgroundColor: '#000000',
    borderWidth: 12,
    borderColor: '#1E293B', // dark slate borders
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
    position: 'relative',
  },
  notch: {
    width: 140,
    height: 32,
    backgroundColor: '#000000',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -70,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  speaker: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E293B',
  },
  camera: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0B132B',
  },
  statusBar: {
    height: 44,
    backgroundColor: COLORS.white,
    paddingTop: 14,
    paddingHorizontal: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 99,
  },
  statusBarTime: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  statusTextIcon: {
    fontSize: 10,
    color: COLORS.text,
  },
  screenInner: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  homeIndicatorContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    pointerEvents: 'none', // Allow touches through
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#000000',
  },
});
