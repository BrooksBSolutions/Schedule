// mainScript.js

document.addEventListener("DOMContentLoaded", function() {
    const contentDiv = document.getElementById("content");

    // Content for small screens (<600px)
    const smallScreenContent = `
    <link rel="stylesheet" href="/style"> 
        <div class="main-header">
            <div class="month-year" id="month-year">
                <div class="month">Loading...</div>
                <div class="year"></div>
            </div>
            <div class="weekdays">
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
            </div>
        </div>
        <div class="calendar" id="calendar">
            <img id="pixle" src="/gif" width="200" height="200" alt="oops"/>
        </div>
        <div class="dash">
            <button id="prev"><</button>
            <button id="todayButton">Today</button>
            <button id="next">></button>
        </div>
        <div id="myModal" class="modal">
        <div class="modal-content">
            <span class="close" id="closeModal">&times;</span>
            <iframe src="/tasks" class="create" style="width:100%; height:800px; border:none;"></iframe>
        </div>
    </div>

    <div id="taskModal" class="modal">
        <div class="modal-content">
            <span id="closeTaskModal" class="close">&times;</span>
            <iframe id="taskModalContent" class="task" src="" style="width: 100%; height:100%;"></iframe>
        </div>
    </div>
    `;

    // Content for large screens (≥600px)
    const largeScreenContent = `
    <link rel="stylesheet" href="/styles"> 
     <div class="header">Work Week Calendar</div>
    <button id="filterTodayButton">Today</button>
    <img id="pixle" src="/gif" width="200" height="200" alt="oops"/>
    <div id="calendar">
        <div id="scroll-container">
            <div class="container">
                <div id="months" class="months"></div>
                <div id="weeks"></div>
            </div>
        </div>
        <button id="prev">Previous</button>
        <button id="next">Next</button>
    </div>
    <script src="mainScript.js"></script>
    <div id="loading" style="display: none;">Loading...</div>

    <div class="contact-message">If there are any bugs or errors, contact Mauro</div>
    <select id="mainDropdown">
        <option value="">Filter...</option>
        <option value="people">People</option>
        <option value="offices">Offices</option>
    </select>

    <label for="subDropdown" id="subLabel" style="display:none;"></label>
    <select id="subDropdown" style="display:none;"></select>
    <button id="resetFilter">X</button>

    <!-- Modal Structure -->
    <div id="myModal" class="modal">
        <div class="modal-content">
            <span class="close" id="closeModal">&times;</span>
            <iframe src="/tasks" class="create" style="width:100%; height:800px; border:none;"></iframe>
        </div>
    </div>

    <div id="taskModal" class="modal">
        <div class="modal-content">
            <span id="closeTaskModal" class="close">&times;</span>
            <iframe id="taskModalContent" class="task" src="" style="width: 100%; height:100%;"></iframe>
        </div>
    </div>
    `;

    function updateLinkState() {
        const mainLink = document.getElementById("style");
        if (window.innerWidth < 600) {
            mainLink.setAttribute('href', '/style'); // Reset href
            mainLink.style.pointerEvents = 'auto'; // Enable clicking
            mainLink.style.opacity = '1'; // Reset opacity// Optional: make it visually appear disabled
        } else {
            mainLink.setAttribute('href', '/styles'); // Reset href
            mainLink.style.pointerEvents = 'auto'; // Enable clicking
            mainLink.style.opacity = '1'; // Reset opacity
        }
    }

    // Function to load content based on screen width
    function loadContentBasedOnScreenSize() {
        if (window.innerWidth < 600) {
            contentDiv.innerHTML = smallScreenContent;
            updateLinkState();
            loadSmall();
        } else {
            contentDiv.innerHTML = largeScreenContent;
            updateLinkState();
            loadLarge();
        }
    }

    // Load content on page load
    loadContentBasedOnScreenSize();

    let flag = false;
    // Reload content on window resize
    window.addEventListener("resize", () => {
        if(window.innerWidth <= 600 && flag == false){
            loadContentBasedOnScreenSize();
            flag = true;
        }
        else if(window.innerWidth > 600 && flag == true){
            loadContentBasedOnScreenSize();
            flag = false;
        }
    });
});

function loadLarge() {
     //* This is a flag to diplay tech or pm view
     const view = true; //? true is pm - false is tech

     const weeksContainer = document.getElementById('weeks');
     const monthsContainer = document.getElementById('months');
     const prevButton = document.getElementById('prev');
     const nextButton = document.getElementById('next');
     const pixle = document.getElementById('pixle');
 
     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
     const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
 
     let onOff = [];
 
     //! When adding other people don't forget to add them to the other js files
     let people = [["Mauro Rubio", "JAX"], ["Josh Rippke", "JAX"], ["Benjamin Howard", "JAX"], ["Nelson Estrada", "JAX"], ["Eric Bloom", "JAX"], ["David Tidings", "MIA"], ["Zahary Stanford", "MIA"], ["David Rodriguez", "MIA"], ["Noah Pribyl", "MIA"], ["Joshua Rodriguez", "CEN"], ["Quinn Shay", "SER"], ["Emmanuel Rodriguez", "SER"]];
 
     people.sort((a, b) => {
         if (a[1] < b[1]) {
             return -1;
         }
         if (a[1] > b[1]) {
             return 1;
         }
         return 0;
     });
 
     let mainDropdown = document.getElementById("mainDropdown");
     let subDropdown = document.getElementById("subDropdown");
     let subLabel = document.getElementById("subLabel");
     let resetButton = document.getElementById("resetFilter");
 
     // Create a set to store unique office names
     //* The filtering section for person or to office  
     let offices = new Set(people.map(person => person[1]));
     
     mainDropdown.addEventListener("change", function() {
         // Clear previous options
         subDropdown.innerHTML = "";
         subDropdown.style.display = "none";
         subLabel.style.display = "none";
 
         if (mainDropdown.value === "people") {
             let option = document.createElement("option");
             option.text = "People";
             option.value = "People";
             subDropdown.appendChild(option);
 
             people.forEach(person => {
                 let option = document.createElement("option");
                 option.text = person[0];
                 option.value = person[0];
                 subDropdown.appendChild(option);
             });
         } else if (mainDropdown.value === "offices") {
             let option = document.createElement("option");
             option.text = "Office";
             option.value = "Office";
             subDropdown.appendChild(option);
 
             offices.forEach(office => {
                 let option = document.createElement("option");
                 option.text = office;
                 option.value = office;
                 subDropdown.appendChild(option);
             });
         }
 
         if (mainDropdown.value) {
             subDropdown.style.display = "block";
             subLabel.style.display = "block";
         }
     });
     subDropdown.addEventListener("change", function() {
         people = [["Mauro Rubio", "JAX"], ["Josh Rippke", "JAX"], ["Benjamin Howard", "JAX"], ["Nelson Estrada", "JAX"], ["Eric Bloom", "JAX"], ["David Tidings", "MIA"], ["Zahary Stanford", "MIA"], ["David Rodriguez", "MIA"], ["Noah Pribyl", "MIA"], ["Joshua Rodriguez", "CEN"], ["Quinn Shay", "SER"], ["Emmanuel Rodriguez", "SER"]];
         people.sort((a, b) => {
             if (a[1] < b[1]) {
                 return -1;
             }
             if (a[1] > b[1]) {
                 return 1;
             }
             return 0;
         });
 
         people = people.filter(person => person[0] === subDropdown.value || person[1] === subDropdown.value);
 
         renderCalendar();
 
     });
     resetButton.addEventListener("click", function() {
         mainDropdown.value = "";
         subDropdown.innerHTML = "";
         subDropdown.style.display = "none";
         subLabel.style.display = "none";
         //? when adding people from other sections dont forget to change this 
         people = [["Mauro Rubio", "JAX"], ["Josh Rippke", "JAX"], ["Benjamin Howard", "JAX"], ["Nelson Estrada", "JAX"], ["Eric Bloom", "JAX"], ["David Tidings", "MIA"], ["Zahary Stanford", "MIA"], ["David Rodriguez", "MIA"], ["Noah Pribyl", "MIA"], ["Joshua Rodriguez", "CEN"], ["Quinn Shay", "SER"], ["Emmanuel Rodriguez", "SER"]];
         people.sort((a, b) => {
             if (a[1] < b[1]) {
                 return -1;
             }
             if (a[1] > b[1]) {
                 return 1;
             }
             return 0;
         });
         renderCalendar();
     });
 
     let currentDate = new Date();
     let startIndex = 0;
     let daysToShow = getDaysToShow(); // Initial number of days to show
 
     const modal = document.getElementById('myModal');
     const modalContent = document.getElementById('modalContent');
     const closeModal = document.getElementById('closeModal');
     const taskModal = document.getElementById('taskModal');
     const taskModalContent = document.getElementById('taskModalContent');
 
     //* This gets the date for the updated time it takes to load site
     function getDateForCall(){
         let startDate = new Date();
 
         startDate.setDate(startDate.getDate() - startDate.getDay()); // Adjust to start of the current week
         startDate.setDate(startDate.getDate() + startIndex * daysToShow);
 
         let month = startDate.getMonth();
         let year = startDate.getUTCFullYear();
         let eMonth, eYear, sMonth, sYear;
 
         if(month == 0){
             sMonth = 11;
             sYear = year - 1;
         }else{
             sMonth = month-1; //Because it is index at 0
             sYear = year;
         }
 
         if(month == 11){
             eMonth = 0;
             eYear = year + 1;
         }else{
             eMonth = month+3;
             eYear = year;
         }
 
         function addLeadingZero(number) {
             return number < 10 ? '0' + number : number;
         }
 
         sMonth = addLeadingZero(sMonth ); 
         eMonth = addLeadingZero(eMonth );
         if (sMonth == '00'){sMonth = '01';}
         if (eMonth == '00'){eMonth = '01';}
         if (sMonth == 13){sMonth = 12;}
         if (eMonth == 13){eMonth = 12;}
 
         return [sMonth, sYear, eMonth, eYear];
     }
 
     function openModal(date) {
         modal.style.display = "block";
         modalContent.src = "/tasks"; // Pass the date as a query parameter
     }
 
     // Updated close button for task modal
     closeModal.onclick = function () {
         modal.style.display = "none";
         set();
     };
 
     function openTaskModal(task) {
         taskModal.style.display = "block";
         taskModalContent.src = `/taskDetails?id=${task.parentId}&person=${task.person}&timeline=${task.timeline}&due=${task.date}&hour=${task.hour}&status=${task.status}&name=${task.name}&sub=${task.subID}&view=${view}`;
     }
 
     // Updated close button for task modal
     closeTaskModal.onclick = function () {
         taskModal.style.display = "none";
         set()
     }
 
     // Function to determine number of days to show based on window width
     function getDaysToShow() {
         const width = window.innerWidth;
         return ((width - 129) / 124);
 
     }
 
     // Function to adjust the calendar based on window size
     function adjustCalendar() {
         daysToShow = getDaysToShow();
         renderCalendar();
     }
 
     // Event listener for window resize
     window.addEventListener('resize', adjustCalendar);
 
     var myVar;
     var array = [];
 
     function set() {
         (async () => {
             let dates = getDateForCall();
             console.log(dates);
             let jsonString = await getSubItems(dates[1], dates[0], dates[3], dates[2]);
             myVar = jsonString;
             let items = myVar.data.boards[0].items_page.items;
             let index = 0;
             array = [];
             // 0 person 1 hours 2 due date 3 timeline 4 status 5 task%done 6 %complete
             for (let i = 0; i < items.length; i++) {
                 let person = items[i].column_values[0].text;
                 let hours = items[i].column_values[1].text;
                 let status = items[i].column_values[4].text;
                 let timeline = items[i].column_values[3].text;
                 let date = items[i].column_values[2].text;
                 let parentId = items[i].parent_item.id;
                 let subID = items[i].id;
 
 
                 // add due date when everything is solved in the ends
                 let name = myVar.data.boards[0].items_page.items[i].name;
 
                 if (hours == '') continue;
 
                 //gets the timeline and splits the hours through out the days in between 
                 let temp = timeline.split(' ');
                 if (timeline != '') {
                     const dates = getDatesBetween(String(temp[0]), String(temp[2]));
                     if (person.includes(',')) {
                         let sub = person.split(', ');
                         let split = hours / dates.length;
                         for (let k = 0; k < sub.length; k++) {
                             for (let j = 0; j < dates.length; j++) {
                                 let add = new group(name, sub[k], (Math.round(split * 100) / 100), status, timeline, dates[j], parentId, subID, index);
                                 array.push(add);
                                 index++;
                             }
                         }
                     } else {
                         let split = hours / dates.length;
                         for (let j = 0; j < dates.length; j++) {
                             let add = new group(name, person, (Math.round(split * 100) / 100), status, timeline, dates[j], parentId, subID, index);
                             array.push(add);
                             index++;
                         }
                     }
                 } else {
                     if (person.includes(',')) {
                         let sub = person.split(', ');
                         for (let k = 0; k < sub.length; k++) {
                             let add = new group(name, sub[k], Number(hours), status, timeline, date, parentId, subID, index);
                             array.push(add);
                             index++;
                         }
                     } else {
                         let add = new group(name, person, Number(hours), status, timeline, date, parentId, subID, index);
                         array.push(add);
                         index++;
                     }
                 }
             }
 
             // prints the array for debugging
             // array.forEach((element) => console.log(element.parentId));
 
             //* this will be commented out and will take priority from the people array 
             // for(let i=0; i < array.length; i++){
             //     if(!people.includes(array[i].person)){
             //         people.push(array[i].person);
             //     }
             // }
             renderCalendar(); 
         })();
     }
 
     set(); //! This line of code starts everything DO NOT TOUCH
 
     //* Start of the Calander Funtion
     function renderCalendar() {
         weeksContainer.innerHTML = '';
         monthsContainer.innerHTML = '';
 
 
         let startDate = new Date();
         let yearDate;
 
         startDate.setDate(startDate.getDate() - startDate.getDay()); // Adjust to start of the current week
         startDate.setDate(startDate.getDate() + startIndex * daysToShow);
 
         let endDate = new Date(startDate);
         endDate.setDate(endDate.getDate() + daysToShow - 1); // Show specified number of days
 
         const displayedDays = [];
         let currentDate = new Date(startDate);
         while (currentDate <= endDate) {
             displayedDays.push(new Date(currentDate));
             currentDate.setDate(currentDate.getDate() + 1);
         }
 
         //* Get the heading for the top dates
         displayedDays.forEach(date => {
             const monthHeader = document.createElement('header');
             monthHeader.classList.add('month');
             monthHeader.textContent = `${daysOfWeek[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`;
 
             // Check if the date is today's date and change the text color to blue
             const today = new Date();
             if (date.toDateString() === today.toDateString()) {
                 monthHeader.style.color = '#007BFF';
             }
 
             monthsContainer.appendChild(monthHeader);
 
             yearDate = date;
         });
 
         // Get year and set it
         const year = yearDate.getFullYear();
         const yearH = document.createElement('header');
         yearH.classList.add('year');
         yearH.textContent = `${year}`;
         monthsContainer.appendChild(yearH);
 
         let currentCity = '';
 
         //* Filters through each person 
         people.forEach((person) => {
             const personRow = document.createElement('div');
             personRow.classList.add('person-row');
             onOff.push(0);
 
             if (person[1] !== currentCity) {
                 currentCity = person[1];
                 const cityHeader = document.createElement('div');
                 cityHeader.classList.add('city-header');
                 cityHeader.textContent = currentCity;
                 weeksContainer.appendChild(cityHeader);
             }
             
             const personName = document.createElement('div');
             personName.classList.add('person');
             personName.textContent = person[0];
 
             personName.addEventListener('click', () => {
                 toggleWeekCollapse(person[0]);
             });
 
             personRow.appendChild(personName);
 
             let alternate = 0;
             // Creates the days that need to be shifted
             displayedDays.forEach(date => {
                 const dayDiv = document.createElement('div');
                 dayDiv.classList.add('week', 'collapsed');
                 dayDiv.dataset.date = date.toISOString().split('T')[0];
                 let dateKey = dayDiv.dataset.date;
 
                 if(alternate%2==0){
                     dayDiv.style.backgroundColor = '#444444';
                 }else{
                     dayDiv.style.backgroundColor = '#333333';
                 }
                 alternate++;
 
                 let tasksForDate = array.filter(task => task.person === person[0] && task.date === dateKey);
                 let totalHours = 0;
 
                 //* Adds the tasks in the day 
                 if (tasksForDate.length === 0) {
                     const dayHour = document.createElement('div');
                     dayHour.classList.add('hour');
                     dayHour.dataset.date = dateKey;
                     dayHour.textContent = `0 / 8 hours`;
                     if(view){
                         dayHour.addEventListener('click', () => {
                         openModal(dateKey);
                         });
                     }
                     dayDiv.appendChild(dayHour);
                 } else {
                     tasksForDate.forEach(task => {
                         const taskDiv = document.createElement('div');
                         taskDiv.classList.add('day');
                         taskDiv.textContent = `${task.name}: ${task.hour} hours${task.status ? ', Status: ' + task.status : ''}`;
                         taskDiv.dataset.date = dateKey;
                         taskDiv.dataset.taskId = task.subID;
                         taskDiv.dataset.index = task.index;
                         if(view)
                         {taskDiv.draggable = true;}
 
                         // Change the border color to most important stat
                         if (task.status === 'Stuck') {
                             dayDiv.style.borderColor = '#dc3545'; // Red
                         } else if (task.status === 'Working on it' && dayDiv.style.borderColor != "rgb(220, 53, 69)") {
                             dayDiv.style.borderColor = '#ffc107'; // Yellow
                         } else if (task.status === 'Done' && (dayDiv.style.borderColor != "rgb(40, 167, 69)" || dayDiv.style.borderColor != "rgb(255, 193, 7)")) {
                             dayDiv.style.borderColor = '#28a745'; // Green
                         } else if (task.status === 'Under Review' && dayDiv.style.borderColor == "rgb(40, 167, 69)") {
                             dayDiv.style.borderColor = '#007bff'; // Blue
                         }
 
                         // Change the color of the task to the status it is 
                         if (task.status === 'Done') {
                             taskDiv.style.backgroundColor = '#28a745'; // Green
                         } else if (task.status === 'Working on it') {
                             taskDiv.style.backgroundColor = '#ffc107'; // Yellow
                         } else if (task.status === 'Stuck') {
                             taskDiv.style.backgroundColor = '#dc3545'; // Red
                         } else if (task.status === 'Under Review') {
                             taskDiv.style.backgroundColor = '#007bff'; // Blue
                         }
 
                         taskDiv.addEventListener('click', () => {
                             openTaskModal(task); // Open task modal when a task is clicked
                         });
                         dayDiv.appendChild(taskDiv);
                         totalHours += task.hour;
                     });
                     // Adds the hours out of 8 to the day
                     const dayHour = document.createElement('div');
                     dayHour.classList.add('hour');
                     dayHour.dataset.date = dateKey;
                     dayHour.textContent = `${totalHours} / 8 hours`;
                     if(view){
                         dayHour.addEventListener('click', () => {
                         openModal(dateKey);
                         });
                     }
                     dayDiv.appendChild(dayHour);
                 }
 
                 //* Creates the circle to place on day
                 const circle = document.createElement('div');
                 let weekHours = tasksForDate.reduce((sum, task) => sum + task.hour, 0);
                 circle.classList.add('circle');
                 const percentageText = document.createElement('span');
                 const percentage = (weekHours / 8) * 100;
                 // Gets the color to put on the circle
                 let color;
                 if (weekHours > 8) {
                     // Makes it red
                     if (weekHours > 12) {
                         percentageText.style.color = '#fff';
                         color = `hsl(0, 100%, 50%)`;
                     } else {
                         percentageText.style.color = '#000';
                         color = `hsl(${(15 - weekHours) * 8}, 100%, 50%)`; // Red
                     }
                 } else if (weekHours == 0) {
                     // Makes it black 
                     color = `hsl(136, 0%, 0%)`;
                     percentageText.style.color = '#fff';
                 } else {
                     // Makes it green
                     const percentage = (weekHours / 8) * 100;
                     const blueShade = 200 - Math.floor((percentage / 100) * 100);
                     color = `hsl(123, 100%, ${(blueShade - 40) / 2}%)`;
                     percentageText.style.color = '#000';
                 }
                 // Adds the attributes for the circle 
                 circle.style.backgroundColor = color;
                 percentageText.textContent = `\n${Math.round(percentage)}%`;
                 percentageText.style.fontSize = '12px';
                 percentageText.style.textAlign = 'center';
                 percentageText.style.fontWeight = 'bold';
                 percentageText.style.position = 'absolute';
                 percentageText.style.width = '100%';
                 percentageText.style.top = '50%';
                 percentageText.style.transform = 'translateY(-50%)';
                 circle.appendChild(percentageText);
                 dayDiv.appendChild(circle);
 
                 dayDiv.addEventListener('dragover', handleDragOver);
                 dayDiv.addEventListener('drop', handleDrop);
 
                 personRow.appendChild(dayDiv);
             });
 
             weeksContainer.appendChild(personRow);
             pixle.style.display = 'none';
         });
 
         document.querySelectorAll('.week').forEach(week => {
             week.addEventListener('click', () => {
                 week.classList.toggle('collapsed');
                 if (!week.classList.contains('collapsed')) {
                     week.scrollIntoView({block: "center", inline: "nearest", behavior: 'smooth'});
                 }
             });
         });
     }
 
     //TODO toggleable name for whole week 
     function toggleWeekCollapse(personName) {
         const indexOfPerson = people.findIndex(person => person[0] == personName);
         const stateOnOff = onOff[indexOfPerson];
 
         if(stateOnOff == 0){
             document.querySelectorAll('.person-row').forEach(row => {
                 if (row.querySelector('.person').textContent === personName) {
                     row.querySelectorAll('.week').forEach(week => {
                         if(week.classList.length == 2){
                             week.classList.toggle('collapsed');
                         }
                     });
                 }
             });
             onOff[indexOfPerson] = 1;
         } else{ 
             document.querySelectorAll('.person-row').forEach(row => {
                 if (row.querySelector('.person').textContent === personName) {
                     row.querySelectorAll('.week').forEach(week => {
                         if(week.classList.length == 1){
                             week.classList.toggle('collapsed');
                         }
                     });
                 }
             });
             onOff[indexOfPerson] = 0;
         }
         
     }
 
     prevButton.addEventListener('click', () => {
         startIndex -= 1;        
         set();
         renderCalendar();
     });
     nextButton.addEventListener('click', () => {
         startIndex += 1;        
         set();
         renderCalendar();
     });
 
     //* Drag feature 
     function handleDragOver(event) {
         // console.log("over");
         event.preventDefault();
         event.currentTarget.classList.add('drag-over');
     }
 
     async function handleDrop(event) {
         event.preventDefault();
         const dayDiv = event.currentTarget;
         const index = event.dataTransfer.getData('number');
         const taskElement = document.querySelector(`[data-index="${index}"]`);
         const task = array[index];
         const taskId = task.subID;
 
         if (taskElement) {
 
             function findLastIndex(arr, callback) {
                 for (let i = arr.length - 1; i >= 0; i--) {
                     if (callback(arr[i])) {
                         return i;
                     }
                 }
                 return -1;
             }
 
             const oldDayDiv = taskElement.parentElement;
             const newDate = dayDiv.dataset.date;
 
             // Update task's date in array            
             const taskLastIndex = findLastIndex(array, task => task.subID === taskId);
             const taskIndex = array.findIndex(task => task.subID === taskId);
 
             let k;
             let lenOfPersonArr;
             let indexForMainArr;
             if(array[index].person == array[taskIndex].person){
                 k = (taskIndex - index);
             } else{
                 let curr = array[taskIndex].person;
                 for (let i = taskIndex; i <= taskLastIndex; i++) {
                     if (curr != array[i].person) {
                         lenOfPersonArr = i - taskIndex;
                         break;
                     }
                 }
                 let subIndex = index - taskIndex;
                 indexForMainArr = subIndex % lenOfPersonArr;
                 indexForMainArr = taskIndex + indexForMainArr
                 k =  taskIndex - indexForMainArr;
             }
 
             let date = newDate.split("-");
             let currPerson = array[taskIndex].person;
             let startDate;
             let endDate;
             let kStart = k;
 
             for (let i = taskIndex; i <= taskLastIndex; i++) {
                 if (currPerson != array[i].person) {
                     k = kStart;
                     currPerson = array[i].person;
                 }
 
                 let currentDate = new Date(`${date[0]}-${date[1]}-${Number(date[2])}`);
                 currentDate.setDate(currentDate.getDate() + k);
                 let formattedDate = currentDate.toISOString().split('T')[0];
 
                 array[i].date = formattedDate;
                 if (i == taskIndex) {
                     startDate = formattedDate;
                 }
                 if (i == taskLastIndex) {
                     endDate = formattedDate;
                 }
 
                 k++;
             }
 
             console.log(startDate);
             console.log(endDate);
 
             //?----------------------------------------------
             //?! Fix bug that indexes the peoples tasks wrong
             //?----------------------------------------------
             // TODO Uncomment this so that you can get the Task to monday to work
             // const response = await updateTask(taskId, endDate, startDate);
             // if (response.data && response.data.change_multiple_column_values.id) {
             //     alert('Your task date was updated');
             // } else {
             //     alert('There was an error updating the date.');
             // }
 
 
             // Move task element to new dayDiv
             dayDiv.appendChild(taskElement);
 
             // Re-render calendar to update hour totals
             event.target.parentElement.style.width = 'auto';
             renderCalendar();
         }
 
         dayDiv.classList.remove('drag-over');
     }
 
     document.addEventListener('dragstart', (event) => {
         if (event.target.classList.contains('day')) {
             event.dataTransfer.setData('number', event.target.dataset.index);
         }
         event.target.parentElement.style.width = '110px';
     });
 
     const todayButton = document.getElementById('filterTodayButton');
     todayButton.addEventListener('click', () => {
         const today = new Date();
         const startOfWeek = new Date(today);
         startOfWeek.setDate(today.getDate() - today.getDay());
 
         // Calculate the number of weeks between the start date and today
         const diffInTime = startOfWeek.getTime() - new Date().getTime();
         startIndex = Math.floor(diffInTime / (1000 * 60 * 60 * 24 * 7)) + 1;
         set();
         renderCalendar();
     });
}

function loadSmall() {
    
    //* This is a flag to diplay tech or pm view
    const view = false; //? true is pm - false is tech

    const calander = document.getElementById('calendar');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let onOff = [];

    //! When adding other people don't forget to add them to the other js files
    let people = [["Mauro Rubio", "JAX"], ["Josh Rippke", "JAX"], ["Benjamin Howard", "JAX"], ["Nelson Estrada", "JAX"], ["Eric Bloom", "JAX"], ["David Tidings", "MIA"], ["Zahary Stanford", "MIA"], ["David Rodriguez", "MIA"], ["Noah Pribyl", "MIA"], ["Joshua Rodriguez", "CEN"], ["Quinn Shay", "SER"], ["Emmanuel Rodriguez", "SER"]];

    people.sort((a, b) => {
        if (a[1] < b[1]) {
            return -1;
        }
        if (a[1] > b[1]) {
            return 1;
        }
        return 0;
    });

    let currentDate = new Date();
    let startIndex = 0;
    let daysToShow = getDaysToShow(); // Initial number of days to show

    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.getElementById('closeModal');
    const taskModal = document.getElementById('taskModal');
    const taskModalContent = document.getElementById('taskModalContent');

    //* This gets the date for the updated time it takes to load site
    function getDateForCall(){
        let startDate = new Date();

        startDate.setDate(startDate.getDate() - startDate.getDay()); // Adjust to start of the current week
        startDate.setDate(startDate.getDate() + startIndex * daysToShow);

        let month = startDate.getMonth();
        let year = startDate.getUTCFullYear();
        let eMonth, eYear, sMonth, sYear;

        if(month == 0){
            sMonth = 11;
            sYear = year - 1;
        }else{
            sMonth = month-1; //Because it is index at 0
            sYear = year;
        }

        if(month == 11){
            eMonth = 0;
            eYear = year + 1;
        }else{
            eMonth = month+3;
            eYear = year;
        }

        function addLeadingZero(number) {
            return number < 10 ? '0' + number : number;
        }

        sMonth = addLeadingZero(sMonth ); 
        eMonth = addLeadingZero(eMonth );
        if (sMonth == '00'){sMonth = '01';}
        if (eMonth == '00'){eMonth = '01';}
        if (sMonth == 13){sMonth = 12;}
        if (eMonth == 13){eMonth = 12;}

        return [sMonth, sYear, eMonth, eYear];
    }

    function openModal(date) {
        modal.style.display = "block";
        modalContent.src = "/tasks"; // Pass the date as a query parameter
    }

    // Updated close button for task modal
    closeModal.onclick = function () {
        modal.style.display = "none";
        set();
    };

    function openTaskModal(task) {
        taskModal.style.display = "block";
        taskModalContent.src = `/taskDetails?id=${task.parentId}&person=${task.person}&timeline=${task.timeline}&due=${task.date}&hour=${task.hour}&status=${task.status}&name=${task.name}&sub=${task.subID}&view=${view}`;
    }

    // Updated close button for task modal
    closeTaskModal.onclick = function () {
        taskModal.style.display = "none";
        set()
    }

    // Function to determine number of days to show based on window width
    function getDaysToShow() {
        return 7;
    }

    // Function to adjust the calendar based on window size
    function adjustCalendar() {
        daysToShow = getDaysToShow();
        renderCalendar();
    }

    // Event listener for window resize
    window.addEventListener('resize', adjustCalendar);

    var myVar;
    var array = [];

    function set() {
        (async () => {
            let dates = getDateForCall();
            console.log(dates);
            let jsonString = await getSubItems(dates[1], dates[0], dates[3], dates[2]);
            myVar = jsonString;
            let items = myVar.data.boards[0].items_page.items;
            let index = 0;
            array = [];
            // 0 person 1 hours 2 due date 3 timeline 4 status 5 task%done 6 %complete
            for (let i = 0; i < items.length; i++) {
                let person = items[i].column_values[0].text;
                let hours = items[i].column_values[1].text;
                let status = items[i].column_values[4].text;
                let timeline = items[i].column_values[3].text;
                let date = items[i].column_values[2].text;
                let parentId = items[i].parent_item.id;
                let subID = items[i].id;


                // add due date when everything is solved in the ends
                let name = myVar.data.boards[0].items_page.items[i].name;

                if (hours == '') continue;

                //gets the timeline and splits the hours through out the days in between 
                let temp = timeline.split(' ');
                if (timeline != '') {
                    const dates = getDatesBetween(String(temp[0]), String(temp[2]));
                    if (person.includes(',')) {
                        let sub = person.split(', ');
                        let split = hours / dates.length;
                        for (let k = 0; k < sub.length; k++) {
                            for (let j = 0; j < dates.length; j++) {
                                let add = new group(name, sub[k], (Math.round(split * 100) / 100), status, timeline, dates[j], parentId, subID, index);
                                array.push(add);
                                index++;
                            }
                        }
                    } else {
                        let split = hours / dates.length;
                        for (let j = 0; j < dates.length; j++) {
                            let add = new group(name, person, (Math.round(split * 100) / 100), status, timeline, dates[j], parentId, subID, index);
                            array.push(add);
                            index++;
                        }
                    }
                } else {
                    if (person.includes(',')) {
                        let sub = person.split(', ');
                        for (let k = 0; k < sub.length; k++) {
                            let add = new group(name, sub[k], Number(hours), status, timeline, date, parentId, subID, index);
                            array.push(add);
                            index++;
                        }
                    } else {
                        let add = new group(name, person, Number(hours), status, timeline, date, parentId, subID, index);
                        array.push(add);
                        index++;
                    }
                }
            }

            // prints the array for debugging
            // array.forEach((element) => console.log(element.parentId));

            //* this will be commented out and will take priority from the people array 
            // for(let i=0; i < array.length; i++){
            //     if(!people.includes(array[i].person)){
            //         people.push(array[i].person);
            //     }
            // }
            renderCalendar(); 
        })();
    }

    set(); //! This line of code starts everything DO NOT TOUCH

    //* Start of the Calander Funtion
    function renderCalendar() {
        const mainHeader = document.getElementById('month-year');
        mainHeader.innerHTML = '';
        calander.innerHTML = '';

        let startDate = new Date();
        let yearDate = new Date();;

        startDate.setDate(startDate.getDate() - startDate.getDay()); // Adjust to start of the current week
        startDate.setDate(startDate.getDate() + startIndex * daysToShow);

        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6); // Show specified number of days

        const displayedDays = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            displayedDays.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        //* Get the heading for the top dates
        

        // Get year and set it
        const currentMonth = startDate.getMonth();
        const month = document.createElement('div');
        month.className = 'month';
        month.textContent = `${months[currentMonth]}`;
        mainHeader.appendChild(month);

        const currentYear = startDate.getFullYear();
        const yearH = document.createElement('div');
        yearH.classList.add('year');
        yearH.textContent = `${currentYear}`;
        mainHeader.appendChild(yearH);

        let currentCity = '';

        //* Filters through each person 
        people.forEach((person) => {
            const personRow = document.createElement('div');
            personRow.classList.add('person');
            onOff.push(0);
            
            const personHeader = document.createElement('div');
            personHeader.classList.add('person-header');

            const name = document.createElement('div');
            name.classList.add('name');
            personHeader.textContent = person[0];

            name.addEventListener('click', () => {
                WeekCollapse(person[0]);
            });

            personHeader.appendChild(name);

            if(view){
                const addTaskButton = document.createElement('button');
                addTaskButton.textContent = '+';
                addTaskButton.classList.add('add-task');

                addTaskButton.addEventListener('click', () => {
                    openModal();
                });

                personHeader.appendChild(addTaskButton);
            }            

            
            

            

            personRow.appendChild(personHeader);


            let alternate = 0;
            // Creates the days that need to be shifted
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('days');

            
            let currDay = new Date().getDate(); // gets current day
            displayedDays.forEach(date => {
                const day = document.createElement('div');
                day.classList.add('day', 'collapsed');
                day.dataset.date = date.toISOString().split('T')[0];
                let dateKey = day.dataset.date;

                const dayHeader = document.createElement('div');
                dayHeader.classList.add('dayHeader');

                const dayNum = document.createElement('div');
                dayNum.classList.add('day-num');
                dayNum.textContent = `${dateKey.split("-")[2]}`;

                const dot = document.createElement('div');
                dot.textContent = "•";
                dot.classList.add('dot');
                dot.style.color = `#aaa`;

                dayHeader.appendChild(dayNum);
                dayHeader.appendChild(dot);
                day.appendChild(dayHeader);

                let tasksForDate = array.filter(task => task.person === person[0] && task.date === dateKey);

                if (tasksForDate.length === 0) {
                    const dayHour = document.createElement('div');
                    day.style.height = '40px';
                    day.style.width = '14%';
                    day.appendChild(dayHour);
                } else {
                    let totalHours = 0;
                    const tasksContainter = document.createElement('div');
                    tasksContainter.classList.add('tasks');
                    tasksForDate.forEach(task => {
                        const taskDiv = document.createElement('div');
                        taskDiv.classList.add('task');
                        taskDiv.textContent = `${task.name}: ${task.hour} hours${task.status ? ', Status: ' + task.status : ''}`;
                        taskDiv.dataset.date = dateKey;
                        taskDiv.dataset.taskId = task.subID;
                        taskDiv.dataset.index = task.index;

                        if (task.status === 'Stuck') {
                            day.style.borderColor = '#dc3545'; // Red
                        } else if (task.status === 'Working on it' && day.style.borderColor != "rgb(220, 53, 69)") {
                            day.style.borderColor = '#ffc107'; // Yellow
                        } else if (task.status === 'Done' && (day.style.borderColor != "rgb(40, 167, 69)" || day.style.borderColor != "rgb(255, 193, 7)")) {
                            day.style.borderColor = '#28a745'; // Green
                        } else if (task.status === 'Under Review' && day.style.borderColor == "rgb(40, 167, 69)") {
                            day.style.borderColor = '#007bff'; // Blue
                        }

                        // Change the color of the task to the status it is 
                        if (task.status === 'Done') {
                            taskDiv.style.backgroundColor = '#28a745'; // Green
                        } else if (task.status === 'Working on it') {
                            taskDiv.style.backgroundColor = '#ffc107'; // Yellow
                        } else if (task.status === 'Stuck') {
                            taskDiv.style.backgroundColor = '#dc3545'; // Red
                        } else if (task.status === 'Under Review') {
                            taskDiv.style.backgroundColor = '#007bff'; // Blue
                        }

                        taskDiv.addEventListener('click', () => {
                            openTaskModal(task); // Open task modal when a task is clicked
                        });
                        tasksContainter.appendChild(taskDiv);
                        totalHours += task.hour;
                    });
                    // Adds the hours out of 8 to the day
                    const dayHour = document.createElement('div');
                    dayHour.classList.add('hour');
                    dayHour.textContent = `${totalHours.toFixed(2)} / 8 hours`;
                    dot.style.color = "#42f551";
                    dayHeader.appendChild(dayHour);
                    day.appendChild(tasksContainter);
                }
                
                

                day.dataset.date = `${date}`;

                if(alternate%2==0){
                    day.style.backgroundColor = '#555555';
                }else{
                    day.style.backgroundColor = '#333333';
                }
                alternate++;


                let totalHours = 0;

                dayDiv.appendChild(day);
            });

            personRow.appendChild(dayDiv);
            calander.appendChild(personRow);
        });

        document.querySelectorAll('.day').forEach(week => {
            week.addEventListener('click', () => {
                week.classList.toggle('collapsed');
            });
        });

    
    }

    prevButton.addEventListener('click', () => {
        startIndex -= 1;     
        console.log("prev");   
        set();
        renderCalendar();
    });
    nextButton.addEventListener('click', () => {
        startIndex += 1;  
        console.log("Next");      
        set();
        renderCalendar();
    });

    const todayButton = document.getElementById('todayButton');
    todayButton.addEventListener('click', () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        // Calculate the number of weeks between the start date and today
        const diffInTime = startOfWeek.getTime() - new Date().getTime();
        startIndex = Math.floor(diffInTime / (1000 * 60 * 60 * 24 * 7)) + 1;
        set();
        renderCalendar();
    });
}


//! No longer used grabs the data for all the subitems, will be changed to monday api
async function fetchJsonFile(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return JSON.stringify(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

//creates object to store all of the data
function group(name, person, hour, status, timeline, date, parentId, subID, index) {
    this.person = person;
    this.name = name;
    this.hour = hour;
    this.status = status;
    this.timeline = timeline;
    this.date = date;
    this.parentId = parentId;
    this.subID = subID;
    this.index = index;
}

//gets the dates in the timeline to spread out where 
function getDatesBetween(startDate, endDate) {
    let dates = [];
    let currentDate = new Date(startDate);
    endDate = new Date(endDate); // Ensure endDate is a Date object

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
        currentDate.setDate(currentDate.getDate() + 1); // Increment the date
    }
    return dates;
}

async function getSubItems(sYear, sMonth, eYear, eMonth) {
    var q = `query { boards (ids:3019184123) { items_page (limit: 500, query_params: {rules: {column_id: "timeline", compare_value: ["${sYear}-${sMonth}-30", "${eYear}-${eMonth}-01"], compare_attribute: "START_DATE", operator:between}}) { cursor items { id name column_values{ text } parent_item{ id } } } } }`;

    const response = await fetch("https://api.monday.com/v2", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjM3MTk2ODIyOSwiYWFpIjoxMSwidWlkIjo2MjAxMjQ0MSwiaWFkIjoiMjAyNC0wNi0xM1QxOTo0MDoxMS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTI3NzUxMjAsInJnbiI6InVzZTEifQ.4OmsrH8TyM59O2221wG4fGzW_jGgA8BUp8dIC_9jk5E'
        },
        body: JSON.stringify({
            query: q
        })
    });

    const res = await response.json();

    let cursor = res.data.boards[0].items_page.cursor;
    while (cursor != null) {
        let con = await getSubItemsCon(cursor);
        cursor = con.data.boards[0].items_page.cursor;

        // Merge items from con to res
        res.data.boards[0].items_page.items.push(...con.data.boards[0].items_page.items);
    }

    console.log(JSON.stringify(res, null, 2));
    return res;
}

async function getSubItemsCon(cursor) {
    var q = `query { boards (ids:3019184123) { items_page (limit: 500, cursor : "${cursor}") { cursor items { id name column_values{ text } parent_item{ id } } } } }`;

    const response = await fetch("https://api.monday.com/v2", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjM3MTk2ODIyOSwiYWFpIjoxMSwidWlkIjo2MjAxMjQ0MSwiaWFkIjoiMjAyNC0wNi0xM1QxOTo0MDoxMS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTI3NzUxMjAsInJnbiI6InVzZTEifQ.4OmsrH8TyM59O2221wG4fGzW_jGgA8BUp8dIC_9jk5E'
        },
        body: JSON.stringify({
            query: q
        })
    });


    let res = await response.json();
    // console.log(JSON.stringify(res, null, 2));
    return res;
}

async function updateTask(subId, end, start,) {
    var q = `mutation {change_multiple_column_values (item_id: ${subId}, board_id: 3019184123, column_values: \"{\\\"timeline\\\" : {\\\"from\\\" : \\\"${start}\\\", \\\"to\\\" : \\\"${end}\\\"}}\") {id}}`;

    const response = await fetch("https://api.monday.com/v2", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjM3MTk2ODIyOSwiYWFpIjoxMSwidWlkIjo2MjAxMjQ0MSwiaWFkIjoiMjAyNC0wNi0xM1QxOTo0MDoxMS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTI3NzUxMjAsInJnbiI6InVzZTEifQ.4OmsrH8TyM59O2221wG4fGzW_jGgA8BUp8dIC_9jk5E'
        },
        body: JSON.stringify({
            query: q
        })
    });

    const res = await response.json();
    console.log(JSON.stringify(res, null, 2));
    return res;
}
