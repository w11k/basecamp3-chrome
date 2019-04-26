import { addTodoFromMessageFeature } from '../features/todo-from-message/TodoFromMessageInsert';
import { addTodoQuickDelayFeature } from '../features/todo-quick-delay/TodoQuickDelayInsert';
import { todoFromMessageFeatureID, todoQuickDelayFeatureID } from './feature-IDs';

export function addFeatures(basecampID: string, options: IExtensionOptions, ...features: string[]) {
  addFixedDOMFeatures(basecampID, options, ...features);
  addDynamicDOMFeatures(basecampID, options, ...features);
}

export function addFixedDOMFeatures(basecampID: string, options: IExtensionOptions, ...features: string[]) {
  if (features.includes(todoFromMessageFeatureID)) addTodoFromMessageFeature(basecampID);
}

export function addDynamicDOMFeatures(basecampID: string, options: IExtensionOptions, ...features: string[]) {
  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    (mutations as any).forEach((mutation: MutationRecord) => {
      if (!mutation.addedNodes) return;
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const node: Node = mutation.addedNodes[i];
        if (features.includes(todoQuickDelayFeatureID)) addTodoQuickDelayFeature(node as Element, basecampID, options.quickDelayDays);
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
