import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { TOOLS, type Tool } from '../data';
import { useT } from '../i18n';
import { Colors, Font, Space, Sports, type SportKey } from '../theme';

type Props = {
  onSelect: (tool: Tool) => void;
};

type TabId = SportKey | 'all';

const TABS: { id: TabId; labelKey: 'tools_tab_all' | 'tools_tab_swim' | 'tools_tab_bike' | 'tools_tab_run' | 'tools_tab_tri' }[] = [
  { id: 'all', labelKey: 'tools_tab_all' },
  { id: 'swim', labelKey: 'tools_tab_swim' },
  { id: 'bike', labelKey: 'tools_tab_bike' },
  { id: 'run', labelKey: 'tools_tab_run' },
  { id: 'tri', labelKey: 'tools_tab_tri' },
];

export function ToolsScreen({ onSelect }: Props) {
  const t = useT();
  const [activeTab, setActiveTab] = useState<TabId>('all');

  const filtered = activeTab === 'all' ? TOOLS : TOOLS.filter((tool) => tool.sport === activeTab);

  return (
    <View style={styles.container}>
      {/* Fixed header */}
      <View style={styles.header}>
        <AppText condensed weight="black" size={34} uppercase style={{ letterSpacing: 1 }}>
          {t('tools_title')}
        </AppText>
        <AppText weight="medium" size={13} color={Colors.textMid} style={{ marginTop: 2 }}>
          {TOOLS.length} {t('tools_sub')}
        </AppText>
      </View>

      {/* Sport tabs — fixed, horizontally scrollable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}>
        {TABS.map((tab) => {
          const sport = tab.id === 'all' ? { icon: '⚡', color: Colors.accent } : Sports[tab.id as SportKey];
          const count = tab.id === 'all' ? TOOLS.length : TOOLS.filter((tool) => tool.sport === tab.id).length;
          const active = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              style={[styles.tab, active && { borderBottomColor: sport.color }]}
              onPress={() => setActiveTab(tab.id)}>
              <AppText size={15}>{sport.icon}</AppText>
              <AppText
                weight="semibold"
                size={13}
                color={active ? sport.color : Colors.textMid}
                style={{ fontFamily: Font.bodySemiBold }}>
                {t(tab.labelKey)}
              </AppText>
              <View style={[styles.tabCount, { backgroundColor: `${sport.color}22` }]}>
                <AppText condensed weight="black" size={10} color={active ? sport.color : Colors.textDim} uppercase>
                  {count}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Scrollable tool list */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filtered.map((tool) => {
          const sport = tool.sport === 'all' ? { icon: '⚡', color: Colors.accent, bg: '#1a1a0a' } : Sports[tool.sport as SportKey];
          return (
            <Pressable key={tool.id} style={styles.toolCard} onPress={() => onSelect(tool)}>
              {/* Left accent stripe */}
              <View style={[styles.stripe, { backgroundColor: sport.color }]} />

              {/* Sport icon */}
              <View style={[styles.toolIcon, { backgroundColor: `${sport.color}22` }]}>
                <AppText size={20}>{tool.icon}</AppText>
              </View>

              {/* Info */}
              <View style={styles.toolInfo}>
                <View style={styles.toolNameRow}>
                  <AppText condensed weight="bold" size={16} style={{ flex: 1 }}>
                    {tool.name}
                  </AppText>
                  <View style={[styles.tagBadge, { backgroundColor: `${sport.color}22` }]}>
                    <AppText condensed weight="bold" size={10} color={sport.color} uppercase style={{ letterSpacing: 0.5 }}>
                      {tool.tag}
                    </AppText>
                  </View>
                </View>
                <AppText size={12} color={Colors.textMid} style={{ marginTop: 3, lineHeight: 17 }}>
                  {tool.desc}
                </AppText>
              </View>

              {/* Chevron */}
              <AppText size={18} color={Colors.textDim}>
                ›
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    paddingHorizontal: Space.screen,
    paddingTop: 20,
    paddingBottom: 0,
  },

  tabsScroll: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexShrink: 0,
  },
  tabsContent: {
    paddingHorizontal: Space.screen,
    paddingTop: 16,
    gap: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    flexShrink: 0,
  },
  tabCount: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },

  list: { flex: 1 },
  listContent: {
    padding: Space.screen,
    paddingTop: 14,
    gap: 8,
  },

  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    paddingVertical: 14,
    paddingRight: 14,
    overflow: 'hidden',
  },
  stripe: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginLeft: 0,
  },
  toolIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  toolInfo: { flex: 1 },
  toolNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    flexShrink: 0,
  },
});
