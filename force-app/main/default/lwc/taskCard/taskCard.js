import { LightningElement, api, track } from 'lwc';
import saveTasks from '@salesforce/apex/TaskBoardController.saveTasks';

export default class TaskCard extends LightningElement {
    //NOTE: @api properties are immutable
    @api task;
    @track tempTask; 
    @track editMode = false;

    edit() {
        this.tempTask = Object.assign({}, this.task);
        this.editMode = true;
    }

    cancelEdit() {
        this.editMode = false;
    }

    handleChange(event) {
        const field = event.target.name;
        this.tempTask[field] = event.target.value;
    }

    //Basic wiring to a save method in Salesforce server
    save() {
        let taskToSave = Object.assign({}, this.tempTask);
        saveTasks({ tasks: [taskToSave] })
            .then(() => {
                this.task = Object.assign({}, this.tempTask);
                this.editMode = false;
            })
            .catch(() => {
                console.log('Something went wrong...');
            })
    }
    
    drag(ev){
        ev.dataTransfer.setData('task', JSON.stringify(this.task));
    }
}