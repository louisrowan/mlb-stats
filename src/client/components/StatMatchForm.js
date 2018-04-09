const React = require('react');

const { Button, Input, Table } = require('semantic-ui-react');


const StatMatchForm = (props) => {

    const {
        minAbIp,
        updateMinAbIp,
        minYear,
        updateMinYear,
        maxYear,
        updateMaxYear,
        minAge,
        updateMinAge,
        maxAge,
        updateMaxAge,
        stats,
        updateStatValue,
        toggleStatActive,
        type
    } = props;

    return (
        <Table collapsing>
            <Table.Body>
            <Table.Row>
                <Table.Cell>Stat</Table.Cell>
                <Table.Cell>Min</Table.Cell>
                <Table.Cell>Max</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>{type === 'Batting' ? 'ab' : 'ip'}</Table.Cell>
                <Table.Cell>
                    <Input
                        onChange={(e) => updateMinAbIp(e.target.value)}
                        type='number'
                        value={minAbIp}
                        min={1}
                    />
                </Table.Cell>
                <Table.Cell>N/A</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Years</Table.Cell>
                <Table.Cell>
                    <Input
                        onChange={(e) => updateMinYear(e.target.value)}
                        type='number'
                        value={minYear}
                        min={1891}
                    />
                </Table.Cell>
                <Table.Cell>
                    <Input
                        onChange={(e) => updateMaxYear(e.target.value)}
                        type='number'
                        value={maxYear}
                        min={1891}
                    />
                </Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>Age</Table.Cell>
                <Table.Cell>
                    <Input
                        onChange={(e) => updateMinAge(e.target.value)}
                        type='number'
                        value={minAge}
                        min={0}
                    />
                </Table.Cell>
                <Table.Cell>
                    <Input
                        onChange={(e) => updateMaxAge(e.target.value)}
                        type='number'
                        value={maxAge}
                        min={0}
                    />
                </Table.Cell>
            </Table.Row>
                {Object.keys(stats).map((s) => {

                    const stat = stats[s];
                    const active = stat.active;
                    const direction = stat.direction;
                    const type = stat.type;

                    if (!active) {
                        return;
                    }

                    const min = stat.min;
                    const max = stat.max;

                    const minVal = min ? min :
                        direction === 'positive' ? 0 : 'N/A';

                    const maxVal = max ? max :
                        direction === 'negative' ? 0 : 'N/A';


                    const error = direction === 'positive' ?
                        !minVal : !maxVal;

                    const step = type === 'count' ? 1 : .01;

                    return (
                    <Table.Row key={s}>
                        <Table.Cell>
                            {s}
                        </Table.Cell>
                        <Table.Cell>
                            <Input
                                onChange={(e) => updateStatValue(s, 'min', e.target.value)}
                                type={+minVal || minVal === 0 ? 'number' : 'text'}
                                min={0}
                                step={step}
                                value={minVal}
                                error={error && direction === 'positive'}
                            />
                        </Table.Cell>
                        <Table.Cell>
                            <Input
                                onChange={(e) => updateStatValue(s, 'max', e.target.value)}
                                type={+maxVal || maxVal === 0 ? 'number' : 'text'}
                                min={0}
                                step={step}
                                value={maxVal}
                                error={error && direction === 'negative'}
                                />
                        </Table.Cell>
                        <Table.Cell>
                            <Button
                                onClick={(e) => toggleStatActive(s)}
                                icon='cancel'
                            />
                        </Table.Cell>
                    </Table.Row>
                    )
                })}
            </Table.Body>
        </Table>
    )
}

module.exports = StatMatchForm;
