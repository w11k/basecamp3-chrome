import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { addCSS } from '../../shared/add-css';
import { todoFromMessagePopupID } from '../../shared/feature-IDs';
import TodoFromMessagePopup from './TodoFromMessagePopup';

class TodoFromMessageButton extends React.Component<TodoFromMessageButtonProps> {
  constructor(props: TodoFromMessageButtonProps) {
    super(props);
  }

  showNewTodoPopup = async () => {
    const todolists: TodolistOptionGroup[] = await this.getTodolists();
    const popup: HTMLElement = this.createOrFindPopupContainer();
    render(
      <TodoFromMessagePopup basecampID={this.props.basecampID} messageID={this.props.messageID} todolistOptions={todolists}/>,
      popup
    );
  };

  getTodolists = async (): Promise<TodolistOptionGroup[]> => {
    // get todolists -> options where to create new to-do
    const projects: any[] = (await axios.get(`https://3.basecamp.com/${this.props.basecampID}/projects.json`)).data;
    const todosets: any[] = await Promise.all(projects
      .filter((p: any) => p.hasOwnProperty('dock'))
      .flatMap((p: any) => p.dock)
      .filter((dock: any) => dock.hasOwnProperty('name') && dock.name === 'todoset' && dock.hasOwnProperty('url'))
      .map((dock: any) => dock.url)
      .map(async (todosetsURL: string) => (await axios.get(todosetsURL)).data)
    );
    const todolists: TodolistOption[] = (await Promise.all(todosets
      .map((todoset: any) => todoset.todolists_url)
      .map(async (todolistURL: string) => (await axios.get(todolistURL)).data)) as any[])
      .flat()
      .map((l: any) => ({ id: l.id, title: l.title, bucketID: l.bucket.id, bucket: l.bucket.name }));
    return this.groupAndSortTodolistOptions(todolists);
  };

  groupAndSortTodolistOptions = (todolistOptions: TodolistOption[]): TodolistOptionGroup[] => {
    // group by bucket
    const groups: TodolistOptionGroup[] = [];
    for (let option of todolistOptions) {
      let labelExists = false;
      for (let group of groups) {
        if (group.bucketID === option.bucketID) {
          group.options.push(option);
          labelExists = true;
          break;
        }
      }
      if (!labelExists) {
        groups.push({ bucketID: option.bucketID, bucket: option.bucket, options: [option] });
      }
    }
    // sort
    return groups.sort((a: TodolistOptionGroup, b: TodolistOptionGroup) => a.bucket.toLowerCase().localeCompare(b.bucket.toLowerCase()));
  };

  createOrFindPopupContainer = (): HTMLElement => {
    let popup: HTMLElement | null = document.getElementById(todoFromMessagePopupID);
    if (!popup) {
      popup = document.createElement('div');
      popup.id = todoFromMessagePopupID;
      document.getElementsByTagName('body')[0].appendChild(popup);
    }
    this.makePopupClosable();
    this.stylePopup();
    return popup;
  };

  makePopupClosable = () => {
    document.addEventListener('click', (event: Event) => {
      if ((event.target as any).closest(`#${todoFromMessagePopupID}`)) return;
      if (document.getElementById(todoFromMessagePopupID)) document.getElementById(todoFromMessagePopupID)!.remove();
    });
  };

  stylePopup = () => {
    addCSS(`
    #${todoFromMessagePopupID} { 
      position: fixed; 
      top: 0; 
      bottom: 0; 
      left: 0; 
      right: 0; 
      z-index: 999; 
      justify-self: center; 
      align-self: center;
      margin: auto;
      height: 70%; 
      min-height: 400px; 
      max-height: 420px; 
      width: 50%; 
      min-width: 340px; 
      max-width: 500px;
      display: flex; 
      align-items: center; 
      justify-content: center; 
      background: white; 
      box-shadow: 0 -1px 10px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.1), 0 5px 15px #f3ece8;
      border-radius: 0.4em
    }
    `);
  };

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{ cursor: 'pointer', color: '#E1533B', fontWeight: 'bold' }}
              onClick={() => this.showNewTodoPopup()}>
          + new todo
        </span>
      </div>
    );
  }
}

export default TodoFromMessageButton;
