import {endpoint} from '../constants';

export const teamsData = {
    get: (periods, divisions) => {
        let url = `${endpoint}/scans/monthly/${periods}`;
        if (divisions === 'weeks') {
            url = `${endpoint}/scans/weekly/${periods}`;
        }
        return fetch(url);
    }
};

/**
 * Invokes an action creator with the
 * result of an API call
 *
 * @returns an TEAMS_FETCHED action which
 * payload will be an array of teams
 * fetched from an API
 */
export const fetchTeamsScans = async (periods, division) => {
    const response = await teamsData.get(periods, division);
    const data = await response.json();
    return data;
}

export const fetchMonth = async (team, date) => {
    const response = await fetch(`${endpoint}/scans/${encodeURIComponent(team)}/${date}`);
    const data = await response.json();
    return data;
}

export const addTeam = async (teamName) => {
    const response = await fetch(`${endpoint}/teams/add/`, {
        method: 'POST',
        body: teamName
    });
    const data = await response.text();
    return data;
}
