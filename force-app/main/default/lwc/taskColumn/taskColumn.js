import { LightningElement, api } from 'lwc';

export default class TaskColumn extends LightningElement {
    @api tasks;
    @api category;

    handleDragOver(event) {
        event.preventDefault();
    }
    handleDrop(event) {
        event.preventDefault();
        const task = JSON.parse(event.dataTransfer.getData('task'));
        task.Status = event.currentTarget.title;
        const dropEvent = new CustomEvent('dropped', {detail : task});
        this.dispatchEvent(dropEvent);
    }
}