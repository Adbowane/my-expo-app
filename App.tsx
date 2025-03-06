import { ScreenContent } from 'components/ScreenContent';
import { EditScreenInfo } from 'components/EditScreenInfo';
import { StatusBar } from 'expo-status-bar';

import './global.css';

export default function App() {
  return (
    <>
      <ScreenContent title="Home" path="App.tsx" />
      <EditScreenInfo path="App.tsx" />
      <StatusBar style="auto" />
    </>
  );
}
