// Bundled font files for apps (SIL Open Font License 1.1). Load them before rendering, then pass
// customFonts to LarkmoorProvider:
//   const [loaded] = useFonts(larkmoorFonts);           // expo-font
//   <LarkmoorProvider customFonts={loaded}>…
// Themes that use system fonts (Harbor) don't need them.
declare const require: (path: string) => number;
export const larkmoorFonts: Record<string, number> = {
  'Geist-Regular': require('../fonts/native/Geist-Regular.ttf'),
  'Geist-Medium': require('../fonts/native/Geist-Medium.ttf'),
  'Geist-SemiBold': require('../fonts/native/Geist-SemiBold.ttf'),
  'MartianMono-Regular': require('../fonts/native/MartianMono-Regular.ttf'),
  'MartianMonoSemiCondensed-Light': require('../fonts/native/MartianMonoSemiCondensed-Light.ttf'),
  'MartianMonoSemiCondensed-Regular': require('../fonts/native/MartianMonoSemiCondensed-Regular.ttf'),
  'MartianMonoSemiCondensed-Medium': require('../fonts/native/MartianMonoSemiCondensed-Medium.ttf'),
};
