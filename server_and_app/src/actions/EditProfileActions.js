import alt from '../alt';
import request from 'superagent';

class EditProfileActions {
    setProfileName(data) {
        this.dispatch(data);
    }

    addPoint() {
        this.dispatch();
    }

    deletePoint(data) {
        this.dispatch(data);
    }

    modifyPoint(data) {
        this.dispatch(data);
    }

    clearPoints(data) {
        this.dispatch(data);
    }

    saveProfile(data) {
        let profile = data.profile;
        profile.lines = pointsToLines(profile.points);

        console.log(profile);

        request
            .post('/api/profiles')
            .send({ profile: profile })
            .end((err, res) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
            });

        this.dispatch();
    }
}

function pointsToLines(points) {
    let lines = [];
    for(let i = 0; i < points.length-1; i++) {
        let line = {};

        line.start = { x: points[i][0], y: points[i][1] };
        line.stop = { x: points[i+1][0], y: points[i+1][1] };

        let deltaY = line.stop.y - line.start.y;
        let deltaX = line.stop.x - line.start.x;
        line.m = deltaY/deltaX;

        line.b = calculateIntercept(line.start, line.m);

        lines.push(line);
    }

    return lines;
}

function calculateIntercept(point, slope) {
    return point.y - (slope * point.x);
}

module.exports = alt.createActions(CreateProfileActions);
