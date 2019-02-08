import { LightningElement, api, wire, track } from 'lwc';
import getTasks from '@salesforce/apex/TaskBoardController.getTasks';
import saveTasks from '@salesforce/apex/TaskBoardController.saveTasks';

export default class TaskBoard extends LightningElement {
    //Allows the component to be aware of the ID of the record (i.e. the Account)
    //that it is embedded on
    @api recordId;
    @track taskMap = {};
    @track tasks = [
        {heading : 'Not Started', tasks : []},
        {heading : 'In Progress', tasks : []},
        {heading : 'Completed', tasks : []},
        {heading : 'Waiting on someone else', tasks : []},
        {heading : 'Deferred', tasks : []}
    ];
    
    @wire(getTasks, { recordId: '$recordId' })
    processTasks({ error, data }) {
        if (data) {
            data.forEach(element => {
                this.taskMap[element.Id] = element;
            });
            this.mapTasks();
            this.record = data;
        } else if (error) {
            console.log(error);
        }
    }

    mapTasks(){
        const catMap = [];
        for (const [key, value] of Object.entries(this.taskMap)) {
            if(!catMap.hasOwnProperty(value.Status)){
                catMap[value.Status] = [];
            }
            catMap[value.Status].push(value);
        }
        this.tasks.forEach(element => {
            element.tasks = [];
            if(catMap.hasOwnProperty(element.heading)){
                element.tasks = catMap[element.heading];
            }
        });
    }

    handleDropped(event){
        this.save(event.detail);
    }

    //Basic wiring to a save method in Salesforce server
    save(taskToSave) {
        saveTasks({ tasks: [taskToSave] })
            .then(() => {
                //this.selectedContact = this.contacts.data.find(contact => contact.Id === contactId);
                if(this.taskMap.hasOwnProperty(taskToSave.Id)){
                    this.taskMap[taskToSave.Id] = taskToSave;
                    this.mapTasks();
                } else {
                    console.log('Something went wrong...');
                }
            })
            .catch(() => {
                console.log('Something went wrong...');
            })
    }
}