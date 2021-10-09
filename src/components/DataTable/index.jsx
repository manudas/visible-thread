import { useEffect, useState } from 'react';
import {
    useSelector,
} from 'react-redux';

import Popup from '../Popup';

import { fetchMonth } from '../../services'

import './styles.scss';

const DataTable = () => {
    const [data, setData] = useState({});
    const [weeklyData, setWeeklyData] = useState(null);
    const teamData = useSelector((state) => {
        return state.teams ?? {};
    });

    const buildDataTable = (data) => {
        let result = null;
        if (data) {
            const groupedData = data.reduce((carry, {
                teamName,
                date,
                scansAMonth,
                scansAWeek,
                totalScans,
            }) => {
                if(!carry[teamName]) carry[teamName] = {data: []};
                if(!carry.headers) carry.headers = [];
                if(!totalScans) {
                    const _date = new Date(date);
                    const month = _date.getUTCMonth();
                    const monthText = _date.toLocaleString('default', { month: 'short' });
                    const year = _date.getUTCFullYear();
                    const dayOfWeek = _date.getUTCDay();
                    const dayOfMonth = _date.getUTCDate();
                    const weekOfMonth = Math.ceil((dayOfMonth - 1 - dayOfWeek) / 7);

                    if(!carry[teamName].data[year]) carry[teamName].data[year] = [];

                    if (scansAWeek !== undefined && !carry[teamName].data[year][month]) carry[teamName].data[year][month] = [];

                    if(!carry.headers[year]) {
                        carry.headers[year] = [];
                    }
                    if (!carry.headers[year][month]) {

                        carry.headers[year][month] = scansAWeek !== undefined ? [] : monthText;

                    }
                    if (scansAWeek !== undefined) {
                        if (!carry.headers[year][month].includes(weekOfMonth)) {
                            carry.headers[year][month].push(weekOfMonth);
                        }
                        carry[teamName].data[year][month].push(scansAWeek);
                    } else {
                        carry[teamName].data[year][month] = scansAMonth;
                    }
                }
                else {
                    const elementCounter = Object.keys(carry[teamName]).length;
                    // response is ordered so totalScan is the last key
                    carry[teamName].totalScans = totalScans;
                    carry[teamName].average = totalScans/elementCounter;
                }
                return carry;
            }, {});

            result = groupedData;
        }

        return result;
    };

    useEffect(() => {
        const preparedData = buildDataTable(teamData);
        setData(preparedData);
    }, [teamData]);

    return (
        Object.keys(data).length > 0
        ?
            <section className="data w-100 text-nowrap d-flex">
                <table className="table fixedTable">
                    <thead>
                        <tr>
                            <th>Team</th>
                            <th>Average</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.keys(data).map(key => {
                                if (key === 'headers') return null;
                                const {
                                    average,
                                    totalScans
                                } = data[key];

                                return  (
                                    <tr
                                        key={key}
                                    >
                                        <td>{key}</td>
                                        <td>{Math.round(average * 100) / 100}</td>
                                        <td>{totalScans}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                <div className="w-75 overflow-auto">
                    <table className="table" data-testid="breakdown-results-table">
                        <thead>
                            <tr>
                                {
                                    data.headers.map((element, year) => {
                                        return element.map((month, indexMonth) => {
                                            return !Array.isArray(month)
                                                ?
                                                    <th
                                                        key={`${indexMonth}-${month}`}
                                                    >
                                                        {month}
                                                    </th>
                                                : month.map((week, indexWeek) => {
                                                    return <th
                                                        key={`${indexMonth}-${month}-${indexWeek}`}
                                                    >
                                                        Month: {indexMonth}, week: {week}
                                                    </th>
                                                })
                                        })
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(data).map(key => {
                                    if (key === 'headers') return null;
                                    const {
                                        data: teamData
                                    } = data[key];

                                    return <tr
                                        key={key}
                                    >
                                        {
                                            teamData.map((element, year) =>
                                                element.map((monthTotal, monthIndex) => {
                                                    // if(!monthTotal) console.log(monthIndex, monthTotal);
                                                    return !Array.isArray(monthTotal)
                                                        ?
                                                            <td
                                                                key={monthIndex}
                                                                onClick={async() => {
                                                                    if (monthTotal) {
                                                                        const breakDown = await fetchMonth(key, `${year}-${monthIndex + 1}-01`);
                                                                        setWeeklyData(breakDown);
                                                                    }
                                                                }}
                                                            >
                                                                {monthIndex}
                                                            </td>
                                                        : monthTotal.map((weekTotal, indexWeek) => {
                                                            return <td
                                                                key={`${monthIndex}-${indexWeek}`}
                                                            >
                                                                {weekTotal}
                                                            </td>
                                                        })
                                                })
                                            )
                                        }
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <Popup data={weeklyData} closePopup={() => setWeeklyData(null)} />
            </section>
        : null
    )
}

export default DataTable;
