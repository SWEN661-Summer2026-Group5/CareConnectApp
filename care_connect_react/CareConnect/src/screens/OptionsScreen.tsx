import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Card, PrimaryButton, SecondaryButton} from '../components/ui';
import {
  ContrastOption,
  FontSizeOption,
  useAppState,
} from '../state/AppState';

export interface OptionsScreenProps {
  onOpenMenu?: () => void;
}

const FONT_SIZES: {label: string; value: FontSizeOption}[] = [
  {label: 'Small', value: 'small'},
  {label: 'Medium', value: 'medium'},
  {label: 'Large', value: 'large'},
  {label: 'XL', value: 'xl'},
];

const CONTRASTS: {label: string; value: ContrastOption}[] = [
  {label: 'Normal', value: 'normal'},
  {label: 'High', value: 'high'},
  {label: 'XHigh', value: 'xhigh'},
];

export default function OptionsScreen({onOpenMenu}: OptionsScreenProps) {
  const {fontSizeOption, contrastOption, setFontSize, setContrast} =
    useAppState();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Options</Text>

      <Card>
        <Text style={styles.heading}>Font Size</Text>
        <View style={styles.grid}>
          {FONT_SIZES.map(({label, value}) => (
            <View key={value} style={styles.gridItem}>
              <SecondaryButton
                label={label}
                testID={`font-${value}`}
                selected={fontSizeOption === value}
                onPress={() => setFontSize(value)}
              />
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.heading}>Contrast</Text>
        <View style={styles.row}>
          {CONTRASTS.map(({label, value}) => (
            <View key={value} style={styles.flex}>
              <SecondaryButton
                label={label}
                testID={`contrast-${value}`}
                selected={contrastOption === value}
                onPress={() => setContrast(value)}
              />
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.spacer} />
      <PrimaryButton
        label="MENU"
        testID="options-menu"
        onPress={() => onOpenMenu?.()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 24},
  title: {fontSize: 28, fontWeight: '600', marginBottom: 24},
  heading: {fontSize: 20, fontWeight: '600', marginBottom: 16},
  grid: {flexDirection: 'row', flexWrap: 'wrap'},
  gridItem: {width: '50%', padding: 6},
  row: {flexDirection: 'row'},
  flex: {flex: 1, marginHorizontal: 4},
  spacer: {flex: 1},
});
