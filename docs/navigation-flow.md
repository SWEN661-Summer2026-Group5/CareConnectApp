# CareConnect Navigation Flow

```mermaid
flowchart TD
    Login -->|Sign In| Home
    Login -->|Forgot Password?| ForgotPassword
    ForgotPassword -->|Back to Login| Login

    Home -->|View Task| TaskDetail
    Home -->|View All Tasks| TaskList
    Home -->|MENU| Menu

    Menu -->|Home| Home
    Menu -->|Tasks| TaskList
    Menu -->|Contacts| ContactList
    Menu -->|Options| Options
    Menu -->|Sign Out| Login

    TaskList -->|Tap task| TaskDetail
    TaskList -->|Add New Task| NewTask
    TaskList -->|MENU| Menu

    TaskDetail -->|Mark as Resolved - pop| TaskList
    TaskDetail -->|MENU| Menu

    NewTask -->|Confirm / Discard - pop| TaskList
    NewTask -->|MENU| Menu

    ContactList -->|Add Contact| AddContact
    ContactList -->|MENU| Menu

    AddContact -->|Confirm / Discard - pop| ContactList
    AddContact -->|MENU| Menu

    Options -->|MENU| Menu
```
