(function() {
    let currentDate = new Date();
    let dailyPlans = {};
    let weeklyPlans = {};
    let monthlyPlans = {};
    let quarterlyPlans = {};
    let yearlyPlans = {};
    let picker = null;

    function navigateDay(delta) {
        currentDate.setDate(currentDate.getDate() + delta);
        updateDayLabel();
    }

    function navigateWeek(delta) {
        currentDate.setDate(currentDate.getDate() + (delta * 7));
        updateWeekLabel();
    }

    function navigateMonth(delta) {
        currentDate.setMonth(currentDate.getMonth() + delta);
        updateMonthLabel();
    }

    function navigateYear(delta) {
        currentDate.setFullYear(currentDate.getFullYear() + delta);
        updateYearLabel();
    }

    function navigateQuarter(delta) {
        currentDate.setMonth(currentDate.getMonth() + (delta * 3));
        updateQuarterLabel();
    }

    function updateDayLabel() {
        const options = { weekday: 'short', year: '2-digit', month: '2-digit', day: '2-digit' };
        const dateStr = currentDate.toLocaleDateString(undefined, options);
        document.getElementById('dayLabel').textContent = `Daily Plan - ${dateStr}`;
        
        const dailyKey = currentDate.toISOString().split('T')[0];
        const dailyTextarea = document.getElementById('dailyPlanner');
        dailyTextarea.value = dailyPlans[dailyKey] || '';
        console.log(dailyKey);
        console.log(dailyTextarea.value);
        
        dailyTextarea.onchange = function() {
            dailyPlans[dailyKey] = this.value;
            localStorage.setItem('dailyPlans', JSON.stringify(dailyPlans));
        };
    }

    function updateWeekLabel() {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const options = { month: '2-digit', day: '2-digit', year: '2-digit' };
        const startStr = startOfWeek.toLocaleDateString(undefined, options);
        document.getElementById('weekLabel').textContent = `Weekly Plan - ${startStr}`;
        
        const weeklyKey = startOfWeek.toISOString().split('T')[0];
        const weeklyTextarea = document.getElementById('weeklyPlanner');
        weeklyTextarea.value = weeklyPlans[weeklyKey] || '';
        
        weeklyTextarea.onchange = function() {
            weeklyPlans[weeklyKey] = this.value;
            localStorage.setItem('weeklyPlans', JSON.stringify(weeklyPlans));
        };
    }

    function updateYearLabel() {
        const year = currentDate.getFullYear();
        document.getElementById('yearLabel').textContent = `Annual Plan - ${year}`;
        
        const yearlyKey = year.toString();
        const yearlyTextarea = document.getElementById('yearlyPlanner');
        yearlyTextarea.value = yearlyPlans[yearlyKey] || '';
        
        yearlyTextarea.onchange = function() {
            yearlyPlans[yearlyKey] = this.value;
            localStorage.setItem('yearlyPlans', JSON.stringify(yearlyPlans));
        };
    }

    function updateQuarterLabel() {
        const year = currentDate.getFullYear();
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
        document.getElementById('quarterLabel').textContent = `Quarterly Plan - Q${quarter} ${year}`;
        
        const quarterlyKey = `${year}-Q${quarter}`;
        const quarterlyTextarea = document.getElementById('quarterlyPlanner');
        quarterlyTextarea.value = quarterlyPlans[quarterlyKey] || '';
        
        quarterlyTextarea.onchange = function() {
            quarterlyPlans[quarterlyKey] = this.value;
            localStorage.setItem('quarterlyPlans', JSON.stringify(quarterlyPlans));
        };
    }

    function updateMonthLabel() {
        const options = { year: 'numeric', month: '2-digit' };
        const monthStr = currentDate.toLocaleDateString(undefined, options);
        document.getElementById('monthLabel').textContent = `Monthly Plan - ${monthStr}`;
        
        const monthlyKey = currentDate.toISOString().slice(0, 7); // YYYY-MM format
        const monthlyTextarea = document.getElementById('monthlyPlanner');
        monthlyTextarea.value = monthlyPlans[monthlyKey] || '';
        
        monthlyTextarea.onchange = function() {
            monthlyPlans[monthlyKey] = this.value;
            localStorage.setItem('monthlyPlans', JSON.stringify(monthlyPlans));
        };
    }

    function showDatePicker(type) {
        if (picker) {
            picker.destroy();
        }
    
        const button = document.getElementById(`${type}CalendarButton`);
        const today = new Date();
    
        picker = new Pikaday({
            field: button,
            position: 'bottom right',
            reposition: false,
            container: document.body,
            bound: false,
            format: 'MM/DD/YYYY',
            defaultDate: currentDate,
            setDefaultDate: true,
            onSelect: function(date) {
                currentDate = date;
                if (type === 'day') {
                    updateDayLabel();
                } else if (type === 'week') {
                    // Adjust to the start of the week (Sunday)
                    const dayOfWeek = date.getDay();
                    date.setDate(date.getDate() - dayOfWeek);
                    currentDate = date;
                    updateWeekLabel();
                }
                this.destroy();
                picker = null;
            },
            onClose: function() {
                this.destroy();
                picker = null;
            },
            disableDayFn: function(date) {
                // For weekly plan, only enable Sundays
                if (type === 'week') {
                    return date.getDay() !== 0;
                }
                return false;
            },
            onRender: function() {
                const calendarContainer = this.el;
                let currentDateButton = calendarContainer.querySelector('.pikaday-current-date-button');
                
                if (!currentDateButton) {
                    currentDateButton = document.createElement('button');
                    currentDateButton.classList.add('pikaday-current-date-button');
                    currentDateButton.innerHTML = 'Current Date';
                    currentDateButton.onclick = function() {
                        const newDate = new Date();
                        if (type === 'week') {
                            const dayOfWeek = newDate.getDay();
                            newDate.setDate(newDate.getDate() - dayOfWeek);
                        }
                        currentDate = newDate;
                        if (type === 'day') {
                            updateDayLabel();
                        } else if (type === 'week') {
                            updateWeekLabel();
                        }
                        picker.destroy();
                        picker = null;
                    };
                    calendarContainer.appendChild(currentDateButton);
                }
            }
        });
    
        // Position the picker
        picker.el.style.position = 'fixed';
        picker.el.style.top = `${button.offsetTop + button.offsetHeight}px`;
        picker.el.style.left = `${button.offsetLeft}px`;
        picker.el.style.zIndex = '1000';
    
        // Add custom class for styling
        picker.el.classList.add('pikaday-custom');
    
        picker.show();
    }

    window.dateFunctions = {
        navigateDay: navigateDay,
        navigateWeek: navigateWeek,
        navigateMonth: navigateMonth,
        navigateYear: navigateYear,
        navigateQuarter: navigateQuarter,
        updateDayLabel: updateDayLabel,
        updateWeekLabel: updateWeekLabel,
        updateMonthLabel: updateMonthLabel,
        updateQuarterLabel: updateQuarterLabel,
        updateYearLabel: updateYearLabel,
        showDatePicker: showDatePicker
    };
})();