import React from 'react';
import { render } from 'react-dom';
import { todoQuickDelayFeatureID } from '../../shared/feature-IDs';
import TodoQuickDelayMenu from './TodoQuickDelayMenu';

export function addTodoQuickDelayFeature(node: Element, basecampID: string, quickDelayDays: number[]) {
  if (!todoQuickDelayFeatureAddable(node)) return;

  const bucketID: string = node.parentElement!.parentElement!.getAttribute('data-url')!.split('buckets/')[1].split('/')[0];
  const todoID: string = node.parentElement!.parentElement!.getAttribute('data-recording-id')!;

  const container = document.createElement('div');
  container.id = todoQuickDelayFeatureID;
  node.getElementsByClassName('action-menu__content')[0].appendChild(container);
  render(
    <TodoQuickDelayMenu basecampID={basecampID} bucketID={bucketID} todoID={todoID} quickDelayDays={quickDelayDays}/>,
    document.getElementById(todoQuickDelayFeatureID)
  );
}

function todoQuickDelayFeatureAddable(node: Element): boolean {
  return node
    && node.classList
    && node.classList.contains('action-menu')
    && node.getElementsByClassName('action-menu__content').length > 0
    && node.getElementsByClassName('todo-quick-delay').length === 0 // only add once
    && node.parentElement !== null
    && node.parentElement!.parentElement !== null
    && node.parentElement!.parentElement!.getAttribute('data-url') !== null
    && node.parentElement!.parentElement!.getAttribute('data-recording-id') !== null
    && node.parentElement!.querySelector('.checkbox .checkbox__content .todo__date') !== null;
}
