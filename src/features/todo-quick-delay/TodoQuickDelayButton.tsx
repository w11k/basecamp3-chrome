import React from 'react';
import axios, { AxiosResponse } from 'axios';
import {
    calculateNewDueDate,
    calculateNewDueMonth,
    getBasecampFormattedDueDate,
    getDelayString, getDelayStringMonths
} from '../../shared/date-helpers';

class TodoQuickDelayButton extends React.Component<TodoQuickDelayProps> {
  state = {
      menuOpened: false
  }

    constructor(props: TodoQuickDelayProps) {
    super(props);
  }

  //only for days and weeks
    delayTodo = async (delay: number) => {
        const task = (await axios.get(`https://3.basecamp.com/${this.props.basecampID}/buckets/${this.props.bucketID}/todos/${this.props.todoID}.json`)).data;
        await axios.put(`https://3.basecamp.com/${this.props.basecampID}/buckets/${this.props.bucketID}/todos/${this.props.todoID}.json`, {
                ...task,
                assignee_ids: task.assignees.map((a: any) => a.id),
                completion_subscriber_ids: task.completion_subscribers.map((s: any) => s.id),
                due_on: calculateNewDueDate(task.due_on, delay)
            }
        ).then((response: AxiosResponse) => {
            this.updateDOMAfterDelay(response.data.due_on);
        });
    };

    //for adding delay of months
    delayTodoMonth = async (delayMonth: number) => {
        const task = (await axios.get(`https://3.basecamp.com/${this.props.basecampID}/buckets/${this.props.bucketID}/todos/${this.props.todoID}.json`)).data;
        await axios.put(`https://3.basecamp.com/${this.props.basecampID}/buckets/${this.props.bucketID}/todos/${this.props.todoID}.json`, {
                ...task,
                assignee_ids: task.assignees.map((a: any) => a.id),
                completion_subscriber_ids: task.completion_subscribers.map((s: any) => s.id),
                due_on: calculateNewDueMonth(task.due_on, delayMonth)
            }
        ).then((response: AxiosResponse) => {
            this.updateDOMAfterDelay(response.data.due_on);
        });
    };

    toggleMenu = async () => {
        if (this.state.menuOpened === false) {
            this.setState({menuOpened: true});
        } else {
            this.setState({menuOpened: false});
        }
    }

  updateDOMAfterDelay = (newDueDate: string) => {
    const newDueDateFormatted: string = getBasecampFormattedDueDate(newDueDate);
    const dueDateNode: Node = document.querySelector(`li.todo#recording_${this.props.todoID} span.todo__date`)!.childNodes[2];
    dueDateNode.nodeValue = newDueDateFormatted;
  };

  render() {
    return (
      <div>
          <div>
              <img className={"todo-delay-menu-button"}
                   style={{width: '1.43em', height: '1.43em', position: 'absolute', top: '0.25em', left: '0', cursor:'move'}}
                   src ={chrome.extension.getURL('img/hamburger.svg')}
                   onClick={this.toggleMenu}>
              </img>
          </div>
          {this.state.menuOpened &&
              <div className={"todo-delay-menu"} style={{width: 'auto', height:'auto', position: 'absolute', top:'0px', left:'-110px',  background: 'white', zIndex: 6,
                  padding: '0.5rem 1.5rem' , borderRadius: '4px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 0 4px rgb(0 0 0 / 10%), 0 5px 20px rgb(0 0 0 / 5%)'}}>
              <div className={"todo-delay-content"}>
                  <ul className="action-list todo-quick-delay">
                      {this.props.quickDelayDays.map(delay =>
                          <li className="action-list__item">
                              <a className="action-list__action" style={{ cursor: 'pointer' }} onClick={() => this.delayTodo(delay)}>
                                  {getDelayString(delay)}
                              </a>
                          </li>
                      )}
                      {this.props.quickDelayMonths.map(delayM =>
                          <li className="action-list__item">
                              <a className="action-list__action" style={{ cursor: 'pointer' }} onClick={() => this.delayTodoMonth(delayM)}>
                                  {getDelayStringMonths(delayM)}
                              </a>
                          </li>
                      )}
                  </ul>
              </div>
              </div>
          }
      </div>
    );
  }
}

export default TodoQuickDelayButton;
