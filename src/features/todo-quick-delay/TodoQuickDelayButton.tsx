import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { calculateNewDueDate, getBasecampFormattedDueDate } from '../../shared/date-helpers';

class TodoQuickDelayButton extends React.Component<TodoQuickDelayProps> {
  constructor(props: TodoQuickDelayProps) {
    super(props);
  }

  delayTodoOneDay = async () => {
    const task = (await axios.get(`https://3.basecamp.com/${this.props.basecampID}/buckets/${this.props.bucketID}/todos/${this.props.todoID}.json`)).data;
    await axios.put(`https://3.basecamp.com/${this.props.basecampID}/buckets/${this.props.bucketID}/todos/${this.props.todoID}.json`, {
        ...task,
        assignee_ids: task.assignees.map((a: any) => a.id),
        completion_subscriber_ids: task.completion_subscribers.map((s: any) => s.id),
        due_on: calculateNewDueDate(task.due_on, 1)
      }
    ).then((response: AxiosResponse) => {
      this.updateDOMAfterDelay(response.data.due_on);
    });
  };

  updateDOMAfterDelay = (newDueDate: string) => {
    const newDueDateFormatted: string = getBasecampFormattedDueDate(newDueDate);
    const dueDateNode: Node = document.querySelector(`li.todo#recording_${this.props.todoID} span.todo__date`)!.childNodes[2];
    dueDateNode.nodeValue = newDueDateFormatted;
  };

  render() {
    return (
      <div>
        <span onClick={this.delayTodoOneDay}
              style={{ color: 'rgba(0,0,0,0.3)', lineHeight: '0rem', position: 'absolute', left: '0.4em', top: '0.95em', cursor: 'pointer' }}>
          +1
        </span>
      </div>
    );
  }
}

export default TodoQuickDelayButton;
