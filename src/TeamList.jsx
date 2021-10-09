import React, {
    useEffect, useState,
} from 'react';

import {
    useDispatch,
} from 'react-redux';

import DebouncedInput from './components/DebouncedInput';

import Switch from './components/Switch';

import { FETCH_TEAMS_SCANS } from './store/action-creators'

import DataTable from './components/DataTable';

import './TeamList.css';
import Popup from './components/Popup';
import { addTeam } from './services';


const TeamList = () => {
    const dispatch = useDispatch();
    const [scanNumber, setScanNumber] = useState(0);
    const [newTeamName, setNewTeamName] = useState(null);
    const [message, setMessage] = useState(null);
    const [isChecked, setChecked] = useState(false);

    useEffect(() => {
        // Taking this approach to show how working with Redux is, considering
        // that this data could be shared by more than one component, even if
        // it's not the case here
        dispatch(FETCH_TEAMS_SCANS(Number(scanNumber), !isChecked ? 'months': 'weeks'));
    } ,[dispatch, scanNumber, isChecked]);


    const toggleChecked = () => setChecked(!isChecked);

    const createNewTeamName = async ( name ) => {
        if (!name) {
            setMessage('Please type a name');
        } else {
            const ok = await addTeam(name);
            if (ok.toLowerCase() === 'true') {
                setMessage('Team added successfuly');
            } else {
                setMessage('Team wasn\'t added as it actually exists one team with the same name');
            }
        }
    }
    return <>
        <DebouncedInput onChangeHandler={(number) => setScanNumber(number)} label="Scans to fetch" />
        <Switch checked={ isChecked } onChange={ toggleChecked } optionLabels={['Weeks', 'Months']} />
        <DataTable />
        <div>
            <DebouncedInput onChangeHandler={(team) => setNewTeamName(team)} label="Create new team" />
            <button
                className="btn btn-primary m-5"
                onClick={() => createNewTeamName(newTeamName)}
            >Click to create</button>
        </div>
        <Popup text={message} closePopup={() => setMessage(null)} />
    </>;
}

export default TeamList;
