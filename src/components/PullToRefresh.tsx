// ============================================
// ShowME App - Pull to Refresh Component
// ============================================

import React, { useState, useCallback } from 'react';
import {
  RefreshControl,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
} from 'react-native';

import { colors } from '../theme/theme';
import { mediumHaptic } from '../utils/haptics';

interface PullToRefreshScrollViewProps extends ScrollViewProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefreshScrollView({ 
  onRefresh, 
  children, 
  ...scrollViewProps 
}: PullToRefreshScrollViewProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await mediumHaptic();
    
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  return (
    <ScrollView
      {...scrollViewProps}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary.main}
          colors={[colors.primary.main, colors.secondary.main]}
          progressBackgroundColor={colors.dark[700]}
        />
      }
    >
      {children}
    </ScrollView>
  );
}

// Hook for pull-to-refresh state management
export function usePullToRefresh(fetchData: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await mediumHaptic();
    
    try {
      await fetchData();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  return {
    refreshing,
    onRefresh,
    refreshControlProps: {
      refreshing,
      onRefresh,
      tintColor: colors.primary.main,
      colors: [colors.primary.main, colors.secondary.main],
      progressBackgroundColor: colors.dark[700],
    },
  };
}

export default PullToRefreshScrollView;
