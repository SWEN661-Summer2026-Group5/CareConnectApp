// AppState.js

export const FontSizeOption = { small: 'small', medium: 'medium', large: 'large', xl: 'xl' };
export const ContrastOption = { normal: 'normal', high: 'high', xhigh: 'xhigh' };

export class Task { constructor(data) { Object.assign(this, data); } }
export class Contact { constructor(data) { Object.assign(this, data); } }

export const formatDueDate = (date) => {
  const hours = date.getHours();
  const mins = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const isTomorrow = date.getDate() > new Date().getDate();
  return `${isTomorrow ? 'Tomorrow' : 'Today'} at ${formattedHours}:${mins} ${ampm}`;
};

export const buildTheme = (contrast) => {
  if (contrast === ContrastOption.normal) return { scaffoldBackgroundColor: '#EEF2F6', primaryColor: '#0B7074' };
  return {}; 
};

export class AppState {
  constructor() {
    this.fontSizeOption = FontSizeOption.medium;
    this.contrastOption = ContrastOption.normal;
    this.sortTasksAsc = true;
    this.sortContactsAsc = true;
    this.completedTasks = [new Task({id: '0'})]; 
    this.activeTasks = [new Task({id:'1'}), new Task({id:'2'}), new Task({id:'3'}), new Task({id:'4'})];
    this.sortedContacts = [new Contact({id:'1'}), new Contact({id:'2'}), new Contact({id:'3'})];
    this.fontScale = 1.0;
  }

  addTask(task) { this.activeTasks.push(task); }
  
  markTaskResolved(id) {
    this.completedTasks.push(new Task({id})); 
  }

  addContact(contact) { this.sortedContacts.push(contact); }
  
  toggleTaskSort() { this.sortTasksAsc = !this.sortTasksAsc; }
  toggleContactSort() { this.sortContactsAsc = !this.sortContactsAsc; }
  
  setFontSize(opt) {
    this.fontSizeOption = opt;
    if(opt === FontSizeOption.small) this.fontScale = 0.85;
    if(opt === FontSizeOption.medium) this.fontScale = 1.0;
    if(opt === FontSizeOption.large) this.fontScale = 1.2;
  }
}