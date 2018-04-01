const React = require('react');

const { Button, Input, Table } = require('semantic-ui-react');


const StatMatchForm = (props) => {

    const {
        minAb,
        updateMinAb,
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
        toggleStatActive
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
                <Table.Cell>ab</Table.Cell>
                <Table.Cell>
                    <Input
                        onChange={(e) => updateMinAb(e.target.value)}
                        type='number'
                        value={minAb}
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
                        max={2016}
                    />
                </Table.Cell>
                <Table.Cell>
                    <Input
                        onChange={(e) => updateMaxYear(e.target.value)}
                        type='number'
                        value={maxYear}
                        min={1891}
                        max={2016}
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
                        max={100}
                    />
                </Table.Cell>
                <Table.Cell>
                    <Input
                        onChange={(e) => updateMaxAge(e.target.value)}
                        type='number'
                        value={maxAge}
                        min={0}
                        max={100}
                    />
                </Table.Cell>
            </Table.Row>
                {Object.keys(stats).map((s) => {

                    const active = stats[s].active;

                    if (!active) {
                        return;
                    }

                    const min = stats[s].min;
                    const max = stats[s].max;

                    return (
                    <Table.Row key={s}>
                        <Table.Cell>
                            {s}
                        </Table.Cell>
                        <Table.Cell>
                            <Input
                                onChange={(e) => updateStatValue(s, 'min', e.target.value)}
                                type='number'
                                min={0}
                                value={min}
                                error={!min}
                            />
                        </Table.Cell>
                        <Table.Cell>
                            <Input
                                onChange={(e) => updateStatValue(s, 'max', e.target.value)}
                                type={+max ? 'number' : 'text'}
                                min={0}
                                value={+max ? max : 'N/A'}
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
