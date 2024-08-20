(function() {
    let currentDate = new Date();
    let dailyPlans = {};
    let weeklyPlans = {};
    let monthlyPlans = {};
    let quarterlyPlans = {};
    let yearlyPlans = {};

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
        updateYearLabel: updateYearLabel
    };
})();