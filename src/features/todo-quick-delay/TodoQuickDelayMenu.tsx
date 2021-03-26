import React from 'react';
import axios, { AxiosResponse } from 'axios';
import {
    calculateNewDueDate, calculateNewDueMonth,
    getBasecampFormattedDueDate,
    getDelayString,
    getDelayStringMonths
} from '../../shared/date-helpers';

class TodoQuickDelayMenu extends React.Component<TodoQuickDelayProps> {
  constructor(props: TodoQuickDelayProps) {
    super(props);
  }

  //for adding delay of days and weeks
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
            {this.props.quickDelayMonths.map(delayM =>
                <li className="action-list__item">
                    <a className="action-list__action" style={{ cursor: 'pointer' }} onClick={() => this.delayTodoMonth(delayM)}>
                        {getDelayStringMonths(delayM)}
                    </a>
                </li>
            )}
        </ul>
      </div>
    );
  }
}

export default TodoQuickDelayMenu;
