import React from 'react';
import { render } from 'react-dom';
import { todoQuickDelayFeatureID, todoQuickDelayFeatureIDForAssigments } from '../../shared/feature-IDs';
import TodoQuickDelayMenu from './TodoQuickDelayMenu';
import TodoQuickDelayButton from './TodoQuickDelayButton';

export function addTodoQuickDelayFeature(node: Element, basecampID: string, quickDelayDays: number[], quickDelayMonths: number[]) {
  if (!todoQuickDelayFeatureAddable(node)) return;

  const bucketID: string = node.parentElement!.parentElement!.getAttribute('data-url')!.split('buckets/')[1].split('/')[0];
  const todoID: string = node.parentElement!.parentElement!.getAttribute('data-recording-id')!;

  const container = document.createElement('div');
  container.id = todoQuickDelayFeatureID;
  node.getElementsByClassName('action-menu__content')[0].appendChild(container);
  render(
    <TodoQuickDelayMenu basecampID={basecampID} bucketID={bucketID} todoID={todoID} quickDelayDays={quickDelayDays} quickDelayMonths={quickDelayMonths}/>,
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

export function addTodoQuickDelayFeatureForAssigments(basecampID: string, quickDelayDays: number[], quickDelayMonths: number[]) {
  const assignmentTodolists: NodeListOf<Element> = document.querySelectorAll('article.todolist--assignments');
  if (!assignmentTodolists) return;

  assignmentTodolists.forEach((assignmentTodolist: Element) => {
    const todos: NodeListOf<Element> = assignmentTodolist.querySelectorAll('li.todo');
    if (!todos) return;

    todos.forEach((todo: Element) => {
      if (todo.classList.contains('unindented')) todo.classList.remove('unindented');

      const insertEl = todo.querySelector('.indent');
      if (!insertEl) return;

      const url: string[] = insertEl.querySelector('.checkbox__content')!.getElementsByTagName('a')[0].getAttribute('href')!.split('/');
      if (!url || url.length < 6) return;

      const bucketID: string = url[3];
      const todoID: string = url[5];

      if (todo.querySelector(`#${todoQuickDelayFeatureIDForAssigments}-${todoID}`) || !bucketID || !todoID) return;

      const container = document.createElement('div');
      container.id = `${todoQuickDelayFeatureIDForAssigments}-${todoID}`;
      insertEl.insertBefore(container, insertEl.childNodes[0]);

      render(
        <TodoQuickDelayButton basecampID={basecampID} bucketID={bucketID} todoID={todoID} quickDelayDays={quickDelayDays} quickDelayMonths={quickDelayMonths}/>,
        document.getElementById(`${todoQuickDelayFeatureIDForAssigments}-${todoID}`)
      );
    });
  });
}
