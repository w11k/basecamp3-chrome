import { addTodoFromMessageFeature } from '../features/todo-from-message/TodoFromMessageInsert';
import { addTodoQuickDelayFeature, addTodoQuickDelayFeatureForAssigments } from '../features/todo-quick-delay/TodoQuickDelayInsert';
import { todoFromMessageFeatureID, todoQuickDelayFeatureID } from './feature-IDs';

export function addFeatures(basecampID: string, options: IExtensionOptions, ...features: string[]) {
  addFixedDOMFeatures(basecampID, options, ...features);
  addDynamicDOMFeatures(basecampID, options, ...features);
}

// for add to-dos from message conversation and add delay on my assignments page
export function addFixedDOMFeatures(basecampID: string, options: IExtensionOptions, ...features: string[]) {
  if (features.includes(todoFromMessageFeatureID)) addTodoFromMessageFeature(basecampID);
  if (features.includes(todoQuickDelayFeatureID)) addTodoQuickDelayFeatureForAssigments(basecampID, options.quickDelayDays, options.quickDelayMonths);
}

// for adding delay in general to-dos page
export function addDynamicDOMFeatures(basecampID: string, options: IExtensionOptions, ...features: string[]) {
  const observer = new MutationObserver((mutations: MutationRecord[]) => {
    (mutations as any).forEach((mutation: MutationRecord) => {
      if (!mutation.addedNodes) return;
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const node: Node = mutation.addedNodes[i];
        if (features.includes(todoQuickDelayFeatureID)) addTodoQuickDelayFeature(node as Element, basecampID, options.quickDelayDays, options.quickDelayMonths);
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
