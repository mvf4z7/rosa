import alt from '../alt';
import request from 'superagent';

class TempProfileActions {
    fetchProfiles() {
        this.dispatch();
        request
            .get('/api/profiles')
            .end(function(err, res) {
                let defaultIdx = res.body.profiles.map(profile => {
                    return profile.name;
                }).indexOf(res.body.defaultProfile);

                this.actions.setProfiles({ profiles: res.body.profiles });
                this.actions.setDefaultIdx({ defaultIdx: defaultIdx });
            });
    }

    setProfiles(data) {
        this.dispatch(data);
    }

    setDefaultIdx(data) {
        this.dispatch(data);
    }
}

module.exports = alt.createActions(TempProfileActions);
