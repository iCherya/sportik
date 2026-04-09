import { View } from 'react-native';

import { AppText } from '../components/AppText';
import { Overlay } from '../components/Overlay';
import { useColors } from '../context/ThemeContext';
import { isAllSports, toolPrimarySport, type Tool } from '../data';
import { useT } from '../i18n';
import { Sports } from '../theme';
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
  const isAll = isAllSports(tool);
  const primarySport = toolPrimarySport(tool);
  const accentColor = primarySport?.color ?? colors.accent;
  const sportLabels: Record<string, string> = {
    run: t('sport_run'), bike: t('sport_bike'), swim: t('sport_swim'), tri: t('sport_tri'),
  };

  const badge = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
      {isAll ? (
        <>
          <AppText size={15}>⚡</AppText>
          <AppText condensed weight="black" size={11} color={accentColor} style={{ letterSpacing: 1.5 }} uppercase>
            {t('sport_all')}
          </AppText>
        </>
      ) : (
        tool.sports.map((s) => (
          <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <AppText size={13}>{Sports[s].icon}</AppText>
            <AppText condensed weight="black" size={11} color={Sports[s].color} style={{ letterSpacing: 1.5 }} uppercase>
              {sportLabels[s]}
            </AppText>
          </View>
        ))
      )}
    </View>
  );

  const body = TOOL_BODIES[tool.id] ?? (
    <View style={{ alignItems: 'center', paddingVertical: 60 }}>
      <AppText size={48} style={{ marginBottom: 16 }}>
        {tool.icon}
      </AppText>
      <AppText condensed weight="black" size={18} color={colors.textMid}>
        {t(tool.nameKey)}
      </AppText>
      <AppText size={13} color={colors.textDim} style={{ marginTop: 6 }}>
        Tool not found
      </AppText>
    </View>
  );

  return (
    <Overlay onBack={onBack} title={t(tool.nameKey)} backLabel={t('nav_tools')} badge={badge}>
      {body}
    </Overlay>
  );
}
