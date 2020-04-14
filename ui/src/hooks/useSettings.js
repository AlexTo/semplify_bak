import {useContext} from 'react';
import SettingsContext from 'src/context/SettingsContext';

export function useSettings() {
  return useContext(SettingsContext);
}
