const planner = document.getElementById('planner');
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskText = document.getElementById('taskText');
    const taskTime = document.getElementById('taskTime');
    const taskCategory = document.getElementById('taskCategory');
    const taskPriority = document.getElementById('taskPriority');
    const currentDateDisplay = document.getElementById('current-date');
    const placeholder = document.getElementById('placeholder');
    const topbar = document.getElementById('topbar');
    const settings = document.getElementById('settings');
    const resetBtn = document.getElementById('resetBtn');

    let selectedDate = new Date();
    let currentView = 'today';
    let tasksByDate = {};

    function getFormattedDate(date) {
      return date.toISOString().split('T')[0];
    }

    function updateDateDisplay() {
      currentDateDisplay.textContent = selectedDate.toDateString();
    }

    function getPriorityColor(priority) {
      if (priority === 'high') return '#FF6B6B';
      if (priority === 'medium') return '#FFA94D';
      return '#A5D6A7';
    }

    function renderPlanner() {
      if (currentView === 'today') {
        const dateKey = getFormattedDate(selectedDate);
        const tasks = tasksByDate[dateKey] || [];

        const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
        planner.innerHTML = '';

        hours.forEach(hour => {
          const hourBlock = document.createElement('div');
          hourBlock.className = 'hour-block';

          const label = document.createElement('div');
          label.className = 'hour-label';
          label.textContent = hour;

          const taskContainer = document.createElement('div');
          taskContainer.className = 'tasks';

          tasks.filter(t => t.time === hour).forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = 'task';
            taskEl.style.backgroundColor = getPriorityColor(task.priority);
            taskEl.innerHTML = `
              <strong>${task.task}</strong>
              <small>${task.category}</small>
              <button onclick="deleteTask('${dateKey}', ${task.id})">x</button>
            `;
            taskContainer.appendChild(taskEl);
          });

          hourBlock.appendChild(label);
          hourBlock.appendChild(taskContainer);
          planner.appendChild(hourBlock);
        });
      } else if (currentView === 'dashboard') {
        planner.innerHTML = '';
        Object.keys(tasksByDate).forEach(dateKey => {
          const dateContainer = document.createElement('div');
          dateContainer.className = 'date-container';
          const dateLabel = document.createElement('h3');
          dateLabel.textContent = new Date(dateKey).toDateString();
          dateContainer.appendChild(dateLabel);

          tasksByDate[dateKey].forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = 'task';
            taskEl.style.backgroundColor = getPriorityColor(task.priority);
            taskEl.innerHTML = `
              <strong>${task.task}</strong>
              <small>${task.category} | ${task.time}</small>
              <button onclick="deleteTask('${dateKey}', ${task.id})">x</button>
            `;
            dateContainer.appendChild(taskEl);
          });

          planner.appendChild(dateContainer);
        });
      }
    }

    function addTask() {
      const dateKey = getFormattedDate(selectedDate);
      if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];

      if (taskText.value && taskTime.value) {
        const [hour, minute] = taskTime.value.split(':').map(Number);
        let roundedHour = minute >= 30 ? hour + 1 : hour;
        if (roundedHour >= 24) roundedHour = 0;
        const roundedTime = `${String(roundedHour).padStart(2, '0')}:00`;

        tasksByDate[dateKey].push({
          id: Date.now(),
          task: taskText.value,
          time: roundedTime,
          category: taskCategory.value,
          priority: taskPriority.value
        });

        taskText.value = '';
        taskTime.value = '';
        renderPlanner();
      }
    }

    function deleteTask(dateKey, id) {
      tasksByDate[dateKey] = tasksByDate[dateKey].filter(t => t.id !== id);
      renderPlanner();
    }

    function navigate(view) {
      currentView = view;

      planner.classList.add('hidden');
      taskInput.classList.add('hidden');
      topbar.classList.add('hidden');
      settings.classList.add('hidden');
      placeholder.classList.add('hidden');

      if (view === 'today') {
        planner.classList.remove('hidden');
        taskInput.classList.remove('hidden');
        topbar.classList.remove('hidden');
        renderPlanner();
      } else if (view === 'dashboard') {
        planner.classList.remove('hidden');
        renderPlanner();
      } else if (view === 'settings') {
        settings.classList.remove('hidden');
      } else {
        placeholder.classList.remove('hidden');
        placeholder.textContent = `${view.charAt(0).toUpperCase() + view.slice(1)} page is under construction.`;
      }
    }

    resetBtn.onclick = () => {
      if (confirm("Are you sure you want to reset all data?")) {
        tasksByDate = {};
        renderPlanner();
        alert("All tasks have been cleared.");
      }
    };

    document.getElementById('prev-day').onclick = () => {
      selectedDate.setDate(selectedDate.getDate() - 1);
      updateDateDisplay();
      renderPlanner();
    };

    document.getElementById('next-day').onclick = () => {
      selectedDate.setDate(selectedDate.getDate() + 1);
      updateDateDisplay();
      renderPlanner();
    };

    addTaskBtn.onclick = addTask;

    updateDateDisplay();
    navigate('today');
