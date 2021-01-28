import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { addCSS } from '../../shared/add-css';
import Loader from 'react-loader-spinner';

class TodoFromMessagePopup extends React.Component<TodoFromMessagePopupProps, TodoFromMessagePopupState> {
  constructor(props: TodoFromMessagePopupProps) {
    super(props);
    this.state = {loading: false};
  }

  addTodo = () => {
    const chosenTodolist: TodolistOption = this.getChosenTodolist();
    const todolistID = chosenTodolist!.id;
    const bucketID = chosenTodolist.bucketID;
    const content: string = this.getMessageText();

    this.setState({loading: true});

    axios.post(
        `https://3.basecamp.com/${this.props.basecampID}/buckets/${bucketID}/todolists/${todolistID}/todos.json`,
        {content}
    ).then((response: AxiosResponse) => {
      this.navigateToNewTodo(response.data);
    }).catch((err) => {
      this.setState({loading: false});
      console.log(err);
      return JSON.parse(err);
    });
  };

  getChosenTodolist = (): TodolistOption => {
    return JSON.parse((document.querySelector('input[name="todolistOption"]:checked')! as HTMLInputElement).value);
  };

  getMessageText = (): string => {
    return document.querySelector(`.chat-line[data-recording-id='${this.props.messageID}']`)!
        .getElementsByClassName('chat-line__bubble')[0]
        .getElementsByClassName('chat-line__body')[0]
        .textContent!;
  };

  navigateToNewTodo = (newTodo: any) => {
    window.location.href = newTodo.app_url;
  };

  style = () => {
    addCSS(`
    .radio-buttons-container input[name="todolistOption"] { 
      -webkit-appearance: none; appearance: none; 
     }
    .radio-buttons-container input[name="todolistOption"]:checked + label { 
      background: #ecf9fd 
    }
    `);
  };

  render() {
    this.style();
    return (
        <div style={{height: '100%', width: '100%', padding: '24px 36px', display: 'flex', flexDirection: 'column'}}>
          {this.state.loading &&
          <div style={{height: '90%', width: '90%', background: 'white', position: 'absolute', textAlign: 'center', padding: '120px 0'}}>
            <Loader
                type="Oval"
                color="blue"
                height={100}
                width={100}
                timeout={10000}
            />
          </div>
          }
          <div style={{background: 'white'}}>
            <h2 style={{marginBottom: '0.3em'}}>Choose a list for the new to-do</h2>
          </div>
          <div style={{overflowY: 'scroll'}}>
            <div>
              {this.props.todolistOptions.map((group, i) =>
                  <div>
                    <h4 style={{margin: '1.4em 0 0.4em 0'}}>{group.bucket}</h4>
                    {group.options.map((o, j) =>
                        <div className="radio-buttons-container" style={{overflow: 'hidden'}}>
                          <input id={`r-${o.id}`} type="radio" name="todolistOption" value={JSON.stringify(o)}
                                 className="radio-button-input" defaultChecked={i === 0 && j === 0}/>
                          <label htmlFor={`r-${o.id}`}
                                 style={{
                                   fontSize: '0.9em',
                                   cursor: 'pointer',
                                   padding: '0.5em 1em',
                                   borderRadius: '1rem',
                                   float: 'left',
                                   textOverflow: 'ellipsis',
                                   width: '100%'
                                 }}>
                            {o.title}
                          </label>
                          <br/>
                        </div>
                    )}
                  </div>
              )}
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '12px'}}>
            <button type="submit" onClick={() => this.addTodo()}
                    className="btn btn--small btn--add-icon btn--with-icon">
              create to-do
            </button>
          </div>
        </div>
    );
  }
};

export default TodoFromMessagePopup;
