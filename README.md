<div align="center">

# CtrlAltDelete 

<a href="https://github.com/johnvardanyan/ctrlaltdelete">
  <img src="logo.png" alt="Logo" style="display:block; margin:auto;">
</a>

</div>

# Synopsis
NinjaManager is a web-based task management application tailored for the administrative team at Code Ninjas, owned by Lego Haryanto. This tool is designed to efficiently handle day-to-day administrative tasks, including membership adjustments, customer request management, and task tracking.

The application is built to integrate seamlessly with the existing Code Ninjas Dashboard, ensuring familiarity and ease of use for employees. Key functionalities include a straightforward task creation system, a comprehensive calendar view for tracking due dates, and a dynamic task status indicator to monitor progress, past due, or completed tasks.

NinjaManager offers a clean, user-friendly interface with essential navigation options such as “Home”, “Create Task”, “Calendar”, “Overview”, and “History”. Each section provides specific functionalities - from displaying current tasks on the Home page to a detailed history of completed tasks. The task management process is streamlined, allowing for easy assignment of tasks to employees, setting priorities, and editing task details.

With NinjaManager, the Code Ninjas administrative team can effectively track and manage tasks, ensuring timely responses and efficient operations. This application is a strategic step towards enhancing administrative efficiency, providing a simple yet powerful tool for day-to-day management.


<a href="https://github.com/johnvardanyan/ctrlaltdelete">
  <img src="pic1.png" alt="Home" style="display:block; margin:auto; ">
</a>

<a href="https://github.com/johnvardanyan/ctrlaltdelete">
  <img src="pic2.png" alt="Create" style="display:block; margin:auto;">
</a>

## Installation

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 18.18.1)
- [npm](https://www.npmjs.com/) (version 9.8.1)

### Backend Installation

1. **Clone the Repository**
2. **Install Backend Dependencies:**
   - In the backend directory, run:
     ```bash
     cd backend
     npm install
     ```
   - Backend dependencies include:
     - dotenv (version 16.3.1)
     - express (version 4.18.1)
     - mongodb (version 6.2.0)
     - mongoose (version 7.6.3)
     - update (version 15.0.4)
     - nodemon (version 3.0.1) (installed globally)

3. **Configuration:**
	
- Database setup
Go to https://www.mongodb.com/atlas/database and create a free database using the following options: 
- Shared cluster (free) 
- Cloud Provider: AWS 
- Region: Any
After creating the database, navigate to ‘Quickstart’ under the ‘Security’ section and create a user.
Next, navigate to ‘Network Access’ and add your IP address.
To get your URI that will be used in the next step, navigate to ‘Database’ under ‘Deployment’. Locate your database and click on ‘Connect’. A pop-up window will appear. In this pop-up window, select the ‘Drivers’ option. Your database’s URI should be visible now. Copy it as it will be used in the next step.

   	- Create a `.env` file in the backend folder.
   	- Add your environment variables to the `.env` file.
     Example:
    	```env
     	PORT=400
     	MONGO_URI=mongodb+srv://<username>:<password>@mernapp.l0dhnve.mongodb.net/?retryWrites=true&w=majority
      ```
Replace `<username>` and `<password>` with your actual credentials.

4. **Connect to Backend Server and Database:**
   - In the terminal, change to the backend directory and run:
     ```bash
     npm run dev
     ```
### Frontend Installation

1. **Install Frontend Dependencies:**
   - In the frontend directory, run:
     ```bash
     cd frontend
     npm install
     ```
   - Frontend dependencies include:
     - @testing-library/jest-dom (version 5.17.0)
     - @testing-library/react (version 13.4.0)
     - @testing-library/user-event (version 13.5.0)
     - react (version 18.2.0)
     - react-datepicker (version 4.21.0)
     - react-dom (version 18.2.0)
     - react-router-dom (version 6.17.0)
     - web-vitals (version 2.1.4)

2. **Start the React Development Server:**
- In a separate terminal, change to the frontend directory and run:
     ```bash
     npm start
     ```

3. **App Startup:**
   - The app should start up.


# Deployment
- Will be added in 191

# Testing
- Will be added in 191

# Developer Instructions
- Will be added in 191

# Timeline

### Key Milestones:

### What we expect to get done in 191
- Add a profile/user database
- Link profile with task
- Add a "completed" button on the home page and connect to History page
- Clean up CSS designs and make them consistent on each page
- Add pop-up notifications on every page to make user experience clearer
- Create a database for the employees
- Create Login page and security
- "Mark Complete" button functionality
- Connect employee database with tasks database

# Credits

Meet the Team:
- John Vardanyan | johnvardanyan@gmail.com | https://github.com/johnvardanyan | www.linkedin.com/in/nairy/
- Elina Grigoryan | elina.grigoryan8@gmail.com | https://github.com/egrigoryan12 | www.linkedin.com/in/elina-grigoryan
- Ashley Palencia – Wisniewski | ashleypalencia-wisn@csus.edu | https://github.com/AshleyPW | www.linkedin.com/in/ashleypalencia
- Jeremy Vuong | jeremyvuong@csus.edu | https://github.com/JxRRRm | https://www.linkedin.com/in/jeremy-vuong-5a1158178/
- Arjun Bhargava | abhargava@csus.edu | https://github.com/NightWolfz2
- Navid Baghaei  |  Navid1.Baghaei@gmail.com | https://github.com/NavidBaghaei | https://www.linkedin.com/in/navid-baghaei-7346602a2/
- Madusha Yakupitiyage | madushayaku@gmail.com | https://github.com/Madusha0909 | https://www.linkedin.com/in/madusha-yakupitiyage-99b202269/ 
- Nikolay Chkhaylo  | nchkhaylo@gmail.com | https://github.com/NikolayChkhaylo 

# License

All rights are observed. This project is not open source.
