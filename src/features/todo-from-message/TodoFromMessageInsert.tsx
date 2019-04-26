import React from 'react';
import { render } from 'react-dom';
import { addCSS } from '../../shared/add-css';
import { todoFromMessageFeatureID } from '../../shared/feature-IDs';
import TodoFromMessageButton from './TodoFromMessageButton';

export function addTodoFromMessageFeature(basecampID: string) {
  const messages: NodeListOf<Element> = document.querySelectorAll('.chat-line__bubble');
  if (!messages) return;

  messages.forEach((message: Element) => {
    const messageID: string = message.parentElement!.getAttribute('data-recording-id')!;

    const todoFromMessageAddon: HTMLElement = document.createElement('div');
    todoFromMessageAddon.id = `${todoFromMessageFeatureID}-${messageID}`;
    message.appendChild(todoFromMessageAddon);

    render(
      <TodoFromMessageButton basecampID={basecampID} messageID={messageID}/>,
      document.querySelector(`#${todoFromMessageFeatureID}-${messageID}`)
    );
  });

  showButtonOnlyOnHover();
}

function showButtonOnlyOnHover() {
  addCSS(`
  .chat-line [id^=${todoFromMessageFeatureID}] {
    position: absolute;
    top: 22px;
    right: -83px;
    display: none;
  }
  .chat-line:hover [id^=${todoFromMessageFeatureID}] {
      display: block;
  }
  .chat-line--me [id^=${todoFromMessageFeatureID}] {
      right: initial;
      left: -83px;
  }
  .chat-line--thread [id^=${todoFromMessageFeatureID}] {
      top: 7px;
  }
  `);
}
