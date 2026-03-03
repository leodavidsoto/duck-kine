/**
 * CRON Scheduler — Automated patient journey tasks
 * Runs periodic jobs for reminders, follow-ups, and no-show detection.
 */

const PatientJourneyService = require('../services/patientJourney.service');

class Scheduler {
    constructor() {
        this.jobs = [];
        this.running = false;
    }

    start() {
        if (this.running) return;
        this.running = true;
        console.log('[SCHEDULER] Started');

        // Every 30 minutes: send 24h reminders
        this.jobs.push(
            setInterval(async () => {
                try {
                    const result = await PatientJourneyService.sendReminders();
                    if (result.sent > 0) {
                        console.log(`[SCHEDULER] Sent ${result.sent} appointment reminders`);
                    }
                } catch (err) {
                    console.error('[SCHEDULER] Reminder job failed:', err.message);
                }
            }, 30 * 60 * 1000)
        );

        // Every hour: send 48h follow-ups
        this.jobs.push(
            setInterval(async () => {
                try {
                    const result = await PatientJourneyService.sendFollowUps();
                    if (result.sent > 0) {
                        console.log(`[SCHEDULER] Sent ${result.sent} follow-up notifications`);
                    }
                } catch (err) {
                    console.error('[SCHEDULER] Follow-up job failed:', err.message);
                }
            }, 60 * 60 * 1000)
        );

        // Every 15 minutes: detect no-shows
        this.jobs.push(
            setInterval(async () => {
                try {
                    const result = await PatientJourneyService.detectNoShows();
                    if (result.marked > 0) {
                        console.log(`[SCHEDULER] Marked ${result.marked} appointments as NO_SHOW`);
                    }
                } catch (err) {
                    console.error('[SCHEDULER] No-show detection failed:', err.message);
                }
            }, 15 * 60 * 1000)
        );

        // Run initial checks on startup (after 10s delay)
        setTimeout(async () => {
            try {
                await PatientJourneyService.sendReminders();
                await PatientJourneyService.sendFollowUps();
                await PatientJourneyService.detectNoShows();
                console.log('[SCHEDULER] Initial checks completed');
            } catch (err) {
                console.error('[SCHEDULER] Initial check failed:', err.message);
            }
        }, 10000);
    }

    stop() {
        this.jobs.forEach(clearInterval);
        this.jobs = [];
        this.running = false;
        console.log('[SCHEDULER] Stopped');
    }
}

module.exports = new Scheduler();
