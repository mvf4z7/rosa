var profiles = {
    profiles: [{
        name: 'Pb-free', //rename series to points
        points: [[0, 25], [42, 150], [110, 220], [134, 260], [143, 260], [202, 150], [240, 25]],
        lines: [{ //rename lines
            start: { x: 0, y: 25 },
            stop: { x: 42, y: 150 },
            m: 125/42,
            b: 25
        }, {
            start: { x: 42, y: 150 },
            stop: { x: 110, y: 220 },
            m: 35/34,
            b: 1815/17
        }, {
            start: { x: 110, y: 220 },
            stop: { x: 134, y: 260 },
            m: 5/3,
            b: 110/3
        }, {
            start: { x: 134, y: 260 },
            stop: { x: 143, y: 260 },
            m: 0,
            b: 260
        }, {
            start: { x: 143, y: 260 },
            stop: { x: 202, y: 150 },
            m: -110/59,
            b: 31070/59
        }, {
            start: { x: 202, y: 150 },
            stop: { x: 240, y: 25 },
            m: -125/38,
            b: 15475/19
        }]
    }, {
        name: 'Pb',
        series: [[0, 25], [42, 150], [110, 220], [134, 260], [143, 260], [202, 150], [240, 25]],
        points: [{
            start: { x: 0, y: 25 },
            stop: { x: 42, y: 150 },
            m: 125/42,
            b: 25
        }, {
            start: { x: 42, y: 150 },
            stop: { x: 110, y: 220 },
            m: 35/34,
            b: 1815/17
        }, {
            start: { x: 110, y: 220 },
            stop: { x: 134, y: 260 },
            m: 5/3,
            b: 110/3
        }, {
            start: { x: 134, y: 260 },
            stop: { x: 143, y: 260 },
            m: 0,
            b: 260
        }, {
            start: { x: 143, y: 260 },
            stop: { x: 202, y: 150 },
            m: -110/59,
            b: 31070/59
        }, {
            start: { x: 202, y: 150 },
            stop: { x: 240, y: 25 },
            m: -125/38,
            b: 15475/19
        }]
    }],
    defaultProfile: 'Pb-free'
};

module.exports = profiles;
