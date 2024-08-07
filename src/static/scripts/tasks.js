document.addEventListener('DOMContentLoaded', async function () {
  let itemID;
  // Load JSON data
  let test = await getItems();

  let people = [["Josh Rippke", 41073542], ["Benjamin Howard", 52435656], ["David Tidings", 52489641], ["Quinn Shay", 41073464], ["Zahary Stanford", 50687090], ["Joshua Rodriguez", 57158016], ["Nelson Estrada", 41073430], ["Eric Bloom", 51047069], ["Emmanuel Rodriguez", 41072693], ["David Rodriguez", 40975827], ["Noah Pribyl", 41072719], ["Mauro Rubio", 62012441]];

  // Initialize search with items from test
  initializeSearch(test.data.boards[0].items_page.items);
  populatePersonDropdown(people);

  function initializeSearch(items) {
      const itemSearch = document.getElementById('itemSearch');
      const searchResults = document.getElementById('searchResults');
      const selectedItem = document.getElementById('selectedItem');

      itemSearch.addEventListener('input', function () {
          const query = itemSearch.value.toLowerCase();
          searchResults.innerHTML = '';
          if (query.length > 0) {
              const filteredItems = items.filter(item => item.name.toLowerCase().includes(query));
              filteredItems.forEach(item => {
                  const itemDiv = document.createElement('div');
                  itemDiv.textContent = item.name;
                  itemDiv.classList.add('search-result');
                  itemDiv.addEventListener('click', function () {
                      itemID = item.id;
                      selectedItem.value = item.name;
                      searchResults.innerHTML = '';
                      itemSearch.value = '';
                  });
                  searchResults.appendChild(itemDiv);
              });
          }
      });
  }

  function populatePersonDropdown(people) {
      const personSelect = document.getElementById('person');
      people.forEach(person => {
          const option = document.createElement('option');
          option.value = person[1];
          option.text = person[0];
          personSelect.appendChild(option);
      });
  }

  //creates the subitem
  async function create_subitem(item, task) {
      let query = `mutation{ create_subitem (parent_item_id: ${item}, item_name: \"${task}\"){ id board { id }}}`;

      const response = await fetch("https://api.monday.com/v2", {
          method: 'post',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjM3MTk2ODIyOSwiYWFpIjoxMSwidWlkIjo2MjAxMjQ0MSwiaWFkIjoiMjAyNC0wNi0xM1QxOTo0MDoxMS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTI3NzUxMjAsInJnbiI6InVzZTEifQ.4OmsrH8TyM59O2221wG4fGzW_jGgA8BUp8dIC_9jk5E'
          },
          body: JSON.stringify({
              query: query
          })
      });

      const res = await response.json();
      console.log(JSON.stringify(res, null, 2));
      return res;
  }

  //updates the subitem with values inputed
  async function updateDate(subId, boardId, hours, value, start, id) {
      var q = `mutation {change_multiple_column_values (item_id: ${subId}, board_id: ${boardId}, column_values: \"{\\\"numbers\\\": ${hours},\\\"date2\\\": {\\\"date\\\":\\\"${value}\\\"}, \\\"timeline\\\" : {\\\"from\\\" : \\\"${start}\\\", \\\"to\\\" : \\\"${value}\\\"},\\\"person\\\" : {\\\"personsAndTeams\\\":[{\\\"id\\\":${id},\\\"kind\\\":\\\"person\\\"}]}}\") {id}}`;

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


  //initialize the flatpickr plugin
  flatpickr("#timeline", {
      mode: "range",
      dateFormat: "Y-m-d",
      onChange: function (selectedDates, dateStr, instance) {
          // dateStr will have the selected range
        //   console.log("Selected range: " + dateStr);
      }
  });

  //handle form submission
  const taskForm = document.getElementById('taskForm');
  taskForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const selectedItem = document.getElementById('selectedItem').value;
      const task = document.getElementById('task').value;
      const person = document.getElementById('person').value;
      const hours = document.getElementById('hours').value;
      const timeline = document.getElementById('timeline').value;

      const dates = timeline.split(" ");

      const response = await create_subitem(itemID, task);

      //check if the subitem was created successfully
      if (response.data && response.data.create_subitem) {
          taskForm.reset();
          alert('Your task was created successfully!');
      } else {
          alert('There was an error creating the task.');
      }

      const subId = response.data.create_subitem.id;
      const boardId = response.data.create_subitem.board.id;


      //   console.log(dates[2]);
      await updateDate(subId, boardId, Number(hours), dates[2], dates[0], person);


      //log the form data for debuging
      //   console.log('Selected Item:', selectedItem);
      //   console.log('Selected Item ID:', itemID);
      //   console.log('Task:', task);
      //   console.log('Person:', person);
      //   console.log('Hours:', hours);
      //   console.log('Timeline:', timeline);
      //   console.log('Notes:', notes);

      //here you can add the code to save the task or send it to a server
  });
});


async function getItems() {
  var q = `query { boards (ids: 2937703132){ items_page (limit: 500) { cursor items { id name } } } }`;

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


//   console.log(JSON.stringify(res, null, 2));


  return res;
}

async function getItemsCon(cursor) {
  var q = `query { items_page_by_column_values (limit: 500, board_id: 2937703132, cursor : "${cursor}") { cursor items { name column_values{ text } parent_item{ id } } } }`;

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
//   console.log(JSON.stringify(res, null, 2));
  return res;
}