document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const editButton = document.getElementById("editTask");
    let isEditing = false;
    const view = urlParams.get('view');
    console.log(view);
    const initalPerson = urlParams.get('person');
    let line = urlParams.get('timeline');
    const dates = line.split(" ");
    
    async function getSubItems() {
        const id = urlParams.get('id');
        const q = `query {
                    items (ids: ${id}) {
                        group{id}
                        name
                        column_values{
                            ... on MirrorValue {
                                display_value
                            }
                            text
                        }
                    }
                }`;
    
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
        // console.log(JSON.stringify(res, null, 2));
        return res;
    }

    async function updateTask(subId, boardId, value, start, id, status) {
        var q = `mutation {change_multiple_column_values (item_id: ${subId}, board_id: ${boardId}, column_values: \"{\\\"status1\\\" : {\\\"index\\\" : \\\"${status}\\\"},\\\"date2\\\": {\\\"date\\\":\\\"${value}\\\"}, \\\"timeline\\\" : {\\\"from\\\" : \\\"${start}\\\", \\\"to\\\" : \\\"${value}\\\"},\\\"person\\\" : {\\\"personsAndTeams\\\":[{\\\"id\\\":${id},\\\"kind\\\":\\\"person\\\"}]}}\") {id}}`;
  
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
    
    const taskDetailsDiv = document.getElementById('taskDetails');
    const name = urlParams.get('name');
    let person = urlParams.get('person');
    let timeline = urlParams.get('timeline');
    let hour = urlParams.get('hour');
    let deadline = urlParams.get('timeline').split(" ")[2];
    let status = urlParams.get('status');

    function renderTaskDetails(task) {
        if (timeline != "" && deadline != "") {
            taskDetailsDiv.innerHTML = `
                <p><strong>Name:</strong> <a href="${task.data.items[0].column_values[17].text}" target="_blank">${task.data.items[0].name}</a></p>
                <p><strong>Office:</strong> ${task.data.items[0].column_values[1].display_value}</p>
                <p><strong>Project #:</strong> ${task.data.items[0].column_values[2].display_value}</p>
                <p><strong>Task Required:</strong> ${name}</p>
                <p><strong>Person:</strong> <span id="person">${person}</span></p>
                <p><strong>Status:</strong> <span id="status">${status}</span></p>
                <p><strong>Hours:</strong> ${hour}</p>
                <p><strong>Timeline:</strong> <span id="timeline">${formatDateRange(timeline)}</span></p>
                <p><strong>Deadline:</strong> ${formatDate(deadline)}</p>
            `;
        } else {
            taskDetailsDiv.innerHTML = `
                <p><strong>Name:</strong> <a href="${task.data.items[0].column_values[17].text}" target="_blank">${task.data.items[0].name}</a></p>
                <p><strong>Office:</strong> ${task.data.items[0].column_values[1].display_value}</p>
                <p><strong>Project #:</strong> ${task.data.items[0].column_values[2].display_value}</p>
                <p><strong>Task Required:</strong> ${name}</p>
                <p><strong>Person:</strong> <span id="person">${person}</span></p>
                <p><strong>Status:</strong> <span id="status">${status}</span></p>
                <p><strong>Hours:</strong> ${hour}</p>
                <p><strong>No Deadline or Timeline</strong></p>
            `;
        }
    }

    const task = await getSubItems();
    renderTaskDetails(task);

    editButton.addEventListener('click', () => {

        //if people are added change here 
        let people = [["Josh Rippke", 41073542], ["Benjamin Howard", 52435656], ["David Tidings", 52489641], ["Quinn Shay", 41073464], ["Zahary Stanford", 50687090], ["Joshua Rodriguez", 57158016], ["Nelson Estrada", 41073430], ["Eric Bloom", 51047069], ["Emmanuel Rodriguez", 41072693], ["David Rodriguez", 40975827], ["Noah Pribyl", 41072719], ["Mauro Rubio", 62012441]];

        let statuses = [["Stuck", 2],["Working on it", 0],["Done", 1],["RFI", 3],["No need", 11]];
        // Initialize search with items from test
        

        function populatePersonDropdown(people) {
            const personSelect = document.getElementById('persons');
            people.forEach(person => {
                const option = document.createElement('option');
                option.value = person[1];
                option.text = person[0];
                personSelect.appendChild(option);
            });
        }

        function populateStatusDropdown(status) {
            const StatusSelect = document.getElementById('statusChange');
            statuses.forEach(status => {
                const option = document.createElement('option');
                option.value = status[1];
                option.text = status[0];
                StatusSelect.appendChild(option);
            });
        }

        function findPersonNameById(id) {
            const person = people.find(p => p[1] == id);
            return person ? person[0] : 'Unknown';
        }
    
        function findStatusTextById(id) {
            const status = statuses.find(s => s[1] == id);
            return status ? status[0] : 'Unknown';
        }

        function findPersonNameByName(name) {
            const person = people.find(p => p[0] == name);
            return person ? person[1] : 'Unknown';
        }    

        if (!isEditing) {
            // Switch to edit mode

            const personSpan = document.getElementById('person');
            const statusSpan = document.getElementById('status');
            const timelineSpan = document.getElementById('timeline');

            statusSpan.innerHTML = `<select id="statusChange" name="statusChange" required>
                                        <option id="statusInput" value="" selected disabled>${status}</option>
                                    </select>`;
            if(view != 'false'){
                personSpan.innerHTML = `<select id="persons" name="persons" required>
                                        <option id="personInput" value="" selected disabled>${person}</option>
                                    </select>`;
                                    
                if (timeline) {
                    timelineSpan.innerHTML = `<input type="text" id="timelineInput" name="timelineInput" value="${timeline}">`;
                    flatpickr("#timelineInput", {
                        mode: "range",
                        dateFormat: "Y-m-d",
                        onChange: function (selectedDates, dateStr, instance) {
                            // dateStr will have the selected range
                            // console.log("Selected range: " + dateStr);
                        }
                    });
                }
            
                populatePersonDropdown(people);
            }            

            populateStatusDropdown(statuses);
            editButton.innerText = 'Save';
            isEditing = true;
        } else {
            // Save the changes
            let date;

            let statusID = document.getElementById('statusChange').value;
            status = findStatusTextById(statusID);

            if(view != 'false'){
                let personID = document.getElementById('persons').value;
                
                if (timeline) {
                    timeline = document.getElementById('timelineInput').value;
                    // console.log(timeline);
                    date = timeline.split(" ");
                    timeline = timeline.replace("to", "-");
                    // console.log(date);
                }
            
                person =  findPersonNameById(personID);
                //TODO Uncomment to change the task
                // updateTask(urlParams.get('sub'), 3019184123, date[2], date[0], personID, statusID);
            } 
            else{
                //TODO Uncomment to change the task
                // updateTask(urlParams.get('sub'), 3019184123, dates[2], dates[0], findPersonNameByName(initalPerson), statusID);
            }
            
           
            
            
            

            // Switch back to view mode
            editButton.innerText = 'Edit';
            isEditing = false;
            renderTaskDetails(task);
            
        }
    });

    document.getElementById('closeButton').addEventListener('click', () => {
        window.close();
    });

    
});

function formatDate(dateString) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Months are zero-indexed
    return date.toLocaleDateString('en-US', options);
}

function formatDateRange(dateRangeString) {
    const [startDateString, endDateString] = dateRangeString.split(' - ');
    const formattedStartDate = formatDate(startDateString);
    const formattedEndDate = formatDate(endDateString);
    return `${formattedStartDate} - ${formattedEndDate}`;
}
