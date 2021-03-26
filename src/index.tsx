import * as serviceWorker from './serviceWorker';
import { parseDelayDayOptionsString } from './shared/date-helpers';
import { addFeatures } from './shared/add-features';
import { todoFromMessageFeatureID, todoQuickDelayFeatureID } from './shared/feature-IDs';
(window as any).axios = require('axios');

serviceWorker.unregister();

// set CSRF token in axios header
(window as any).axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
  'X-CSRF-TOKEN' : document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
};

// wait until base URL from basecamp is detected (triggered by background.js)
chrome.runtime.onMessage.addListener((msg: IExtensionMessage) => {
  const basecampID: string = msg.basecampID;
  const quickDelayDays: number[] = msg.options.quickDelayDays ? parseDelayDayOptionsString(msg.options.quickDelayDays as any as string) : [1,3,7];
  const quickDelayMonths: number[] = [1];
  const options: IExtensionOptions = { ...msg.options, quickDelayDays, quickDelayMonths };

  addFeatures(basecampID, options, todoQuickDelayFeatureID, todoFromMessageFeatureID);
});
