import { View } from 'react-native';

import { AppText } from '../components/AppText';
import { Overlay } from '../components/Overlay';
import type { Tool } from '../data';
import { useT } from '../i18n';
import { Colors, Sports, type SportKey } from '../theme';

type Props = {
  tool: Tool;
  onBack: () => void;
};

export function ToolDetail({ tool, onBack }: Props) {
  const t = useT();
  const sport = Sports[tool.sport as SportKey];

  const badge = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      <AppText size={15}>{sport.icon}</AppText>
      <AppText
        condensed
        weight="black"
        size={11}
        color={sport.color}
        style={{ letterSpacing: 1.5 }}
        uppercase>
        {sport.label}
      </AppText>
    </View>
  );

  return (
    <Overlay onBack={onBack} title={tool.name} backLabel={t('nav_tools')} badge={badge}>
      {/* Tool components are wired in Phase 6 */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 60,
        }}>
        <AppText size={48} style={{ marginBottom: 16 }}>
          {tool.icon}
        </AppText>
        <AppText condensed weight="black" size={18} color={Colors.textMid}>
          {tool.name}
        </AppText>
        <AppText size={13} color={Colors.textDim} style={{ marginTop: 6 }}>
          Tool UI coming in Phase 6
        </AppText>
      </View>
    </Overlay>
  );
}
