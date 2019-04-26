import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { calculateNewDueDate, getBasecampFormattedDueDate, getDelayString } from '../../shared/date-helpers';

class TodoQuickDelayMenu extends React.Component<TodoQuickDelayMenuProps> {
  constructor(props: TodoQuickDelayMenuProps) {
    super(props);
  }

  delayTodo = async (delay: number) => {
    const task = (await axios.get(`https://3.basecamp.com/${this.props.basecampID}/buckets/${this.props.bucketID}/todos/${this.props.todoID}.json`)).data;
    await axios.put(`https://3.basecamp.com/${this.props.basecampID}/buckets/${this.props.bucketID}/todos/${this.props.todoID}.json`, {
        ...task,
        due_on: calculateNewDueDate(task.due_on, delay)
      }
    ).then((response: AxiosResponse) => {
      this.updateDOMAfterDelay(response.data.due_on);
    });
  };

  updateDOMAfterDelay = (newDueDate: string) => {
    const newDueDateFormatted: string = getBasecampFormattedDueDate(newDueDate);
    const dueDateNode: Node = document.querySelector(`li[data-recording-id='${this.props.todoID}'] span.todo__date a`)!.childNodes[2];
    dueDateNode.nodeValue = newDueDateFormatted;
  };

  render() {
    return (
      <div>
        <ul className="action-list todo-quick-delay" style={{ borderTop: '1px solid #e5e5e5' }}>
          {this.props.quickDelayDays.map(delay =>
            <li className="action-list__item">
              <a className="action-list__action" style={{ cursor: 'pointer' }} onClick={() => this.delayTodo(delay)}>
                {getDelayString(delay)}
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default TodoQuickDelayMenu;
