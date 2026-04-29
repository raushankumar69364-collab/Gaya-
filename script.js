// Clock configuration with timezones
const clocks = [
    { id: 'ny', timezone: 'America/New_York' },
    { id: 'london', timezone: 'Europe/London' },
    { id: 'paris', timezone: 'Europe/Paris' },
    { id: 'tokyo', timezone: 'Asia/Tokyo' },
    { id: 'sydney', timezone: 'Australia/Sydney' },
    { id: 'dubai', timezone: 'Asia/Dubai' },
    { id: 'singapore', timezone: 'Asia/Singapore' },
    { id: 'la', timezone: 'America/Los_Angeles' },
    { id: 'mumbai', timezone: 'Asia/Kolkata' }
];

// Settings
let settings = {
    use24Hour: true,
    showSeconds: true
};

// Initialize event listeners
document.getElementById('toggle-24h').addEventListener('click', () => {
    settings.use24Hour = !settings.use24Hour;
    updateAllClocks();
});

document.getElementById('toggle-seconds').addEventListener('click', () => {
    settings.showSeconds = !settings.showSeconds;
    updateAllClocks();
});

// Format time based on settings
function formatTime(date, use24Hour, showSeconds) {
    const options = {
        hour12: !use24Hour,
        hour: '2-digit',
        minute: '2-digit',
        second: showSeconds ? '2-digit' : undefined,
        timeZone: 'UTC'
    };

    if (!showSeconds) {
        delete options.second;
    }

    return date.toLocaleTimeString('en-US', options);
}

// Format date
function formatDate(date, timezone) {
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: timezone
    };

    return date.toLocaleDateString('en-US', options);
}

// Get time for a specific timezone
function getTimeInTimezone(timezone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const parts = formatter.formatToParts(new Date());
    const timeObj = {};

    parts.forEach(part => {
        timeObj[part.type] = part.value;
    });

    return {
        hour: timeObj.hour,
        minute: timeObj.minute,
        second: timeObj.second
    };
}

// Format time string with settings
function formatTimeString(hour, minute, second, use24Hour, showSeconds) {
    let h = parseInt(hour);
    let period = '';

    if (!use24Hour) {
        period = h >= 12 ? ' PM' : ' AM';
        h = h % 12 || 12;
    }

    const hStr = String(h).padStart(2, '0');
    let timeStr = `${hStr}:${minute}`;

    if (showSeconds) {
        timeStr += `:${second}`;
    }

    return timeStr + period;
}

// Update a single clock
function updateClock(clockConfig) {
    const time = getTimeInTimezone(clockConfig.timezone);
    const timeString = formatTimeString(
        time.hour,
        time.minute,
        time.second,
        settings.use24Hour,
        settings.showSeconds
    );

    const clockElement = document.getElementById(`${clockConfig.id}-clock`);
    if (clockElement) {
        clockElement.textContent = timeString;
    }

    // Update date
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        timeZone: clockConfig.timezone
    });

    const dateElement = document.getElementById(`${clockConfig.id}-date`);
    if (dateElement) {
        dateElement.textContent = dateFormatter.format(new Date());
    }
}

// Update all clocks
function updateAllClocks() {
    clocks.forEach(updateClock);
}

// Initialize
updateAllClocks();

// Update every second
setInterval(updateAllClocks, 1000);

// Update on visibility change (when tab becomes visible)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateAllClocks();
    }
});

console.log('Digital Clock initialized successfully!');
console.log('Timezone support:', Intl.DateTimeFormat.prototype.resolvedOptions().timeZone ? 'Enabled' : 'Disabled');
