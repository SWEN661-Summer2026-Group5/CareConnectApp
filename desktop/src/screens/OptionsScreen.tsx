import { Card, PrimaryButton, SecondaryButton } from '../components/ui';
import { ContrastOption, FontSizeOption, useAppState } from '../state/AppState';

export interface OptionsScreenProps {
  onOpenMenu?: () => void;
}

const FONT_SIZES: { label: string; value: FontSizeOption; spoken: string }[] = [
  { label: 'Small', value: 'small', spoken: 'small' },
  { label: 'Medium', value: 'medium', spoken: 'medium' },
  { label: 'Large', value: 'large', spoken: 'large' },
  { label: 'XL', value: 'xl', spoken: 'extra large' },
];

const CONTRASTS: { label: string; value: ContrastOption; spoken: string }[] = [
  { label: 'Normal', value: 'normal', spoken: 'normal' },
  { label: 'High', value: 'high', spoken: 'high' },
  { label: 'XHigh', value: 'xhigh', spoken: 'extra high' },
];

export default function OptionsScreen({ onOpenMenu }: OptionsScreenProps) {
  const { fontSizeOption, contrastOption, setFontSize, setContrast } =
    useAppState();

  return (
    <>
      <h1 className="screen-title" tabIndex={-1}>
        Options
      </h1>

      <Card>
        <h2 className="section-heading">Font Size</h2>
        <div className="option-grid" role="group" aria-label="Font size">
          {FONT_SIZES.map(({ label, value, spoken }) => (
            <SecondaryButton
              key={value}
              label={label}
              aria-label={`Font size ${spoken}`}
              selected={fontSizeOption === value}
              onClick={() => setFontSize(value)}
            />
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="section-heading">Contrast</h2>
        <div className="option-row" role="group" aria-label="Contrast">
          {CONTRASTS.map(({ label, value, spoken }) => (
            <SecondaryButton
              key={value}
              label={label}
              aria-label={`Contrast ${spoken}`}
              selected={contrastOption === value}
              onClick={() => setContrast(value)}
            />
          ))}
        </div>
      </Card>

      <div className="stack-gap" />
      <PrimaryButton
        label="MENU"
        aria-label="Open menu"
        onClick={() => onOpenMenu?.()}
      />
    </>
  );
}
