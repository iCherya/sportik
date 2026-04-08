import { View } from 'react-native';

import { AppText } from '../components/AppText';
import { Overlay } from '../components/Overlay';
import { useColors } from '../context/ThemeContext';
import type { Tool } from '../data';
import { useT } from '../i18n';
import { Sports, type SportKey } from '../theme';
import { CadenceBeeper } from '../tools/CadenceBeeper';
import { CalorieBurn } from '../tools/CalorieBurn';
import { HRZones } from '../tools/HRZones';
import { NutritionCalc } from '../tools/NutritionCalc';
import { PaceCalc } from '../tools/PaceCalc';
import { PoolCounter } from '../tools/PoolCounter';
import { PowerZones } from '../tools/PowerZones';
import { RaceChecklist } from '../tools/RaceChecklist';
import { RaceSplitPlanner } from '../tools/RaceSplitPlanner';
import { RaceTimePredictor } from '../tools/RaceTimePredictor';
import { SpeedPace } from '../tools/SpeedPace';
import { SwolfCalc } from '../tools/SwolfCalc';
import { TaperCalc } from '../tools/TaperCalc';
import { TransitionEstimator } from '../tools/TransitionEstimator';
import { WetsuitGuide } from '../tools/WetsuitGuide';

type Props = {
  tool: Tool;
  onBack: () => void;
};

const TOOL_BODIES: Record<string, React.ReactNode> = {
  pace: <PaceCalc />,
  cadence: <CadenceBeeper />,
  hr: <HRZones />,
  power: <PowerZones />,
  split: <RaceSplitPlanner />,
  predict: <RaceTimePredictor />,
  nutrition: <NutritionCalc />,
  swolf: <SwolfCalc />,
  speed: <SpeedPace />,
  transition: <TransitionEstimator />,
  wetsuit: <WetsuitGuide />,
  calorie: <CalorieBurn />,
  checklist: <RaceChecklist />,
  pool: <PoolCounter />,
  taper: <TaperCalc />,
};

export function ToolDetail({ tool, onBack }: Props) {
  const t = useT();
  const colors = useColors();
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

  const body = TOOL_BODIES[tool.id] ?? (
    <View style={{ alignItems: 'center', paddingVertical: 60 }}>
      <AppText size={48} style={{ marginBottom: 16 }}>
        {tool.icon}
      </AppText>
      <AppText condensed weight="black" size={18} color={colors.textMid}>
        {tool.name}
      </AppText>
      <AppText size={13} color={colors.textDim} style={{ marginTop: 6 }}>
        Tool not found
      </AppText>
    </View>
  );

  return (
    <Overlay onBack={onBack} title={tool.name} backLabel={t('nav_tools')} badge={badge}>
      {body}
    </Overlay>
  );
}
