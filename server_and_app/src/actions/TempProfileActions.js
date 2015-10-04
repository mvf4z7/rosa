import alt from '../alt';
import request from 'superagent';

class TempProfileActions {
    fetchProfiles() {
        this.dispatch();

        request
            .get('/api/profiles')
            .end((err, res) => {
                let defaultIdx = res.body.profiles.map(profile => {
                    return profile.name;
                }).indexOf(res.body.defaultProfile);

                this.actions.setProfiles({ profiles: res.body.profiles });
                this.actions.setSelectedProfileIdx({ selectedProfileIdx: defaultIdx });
                this.actions.setDefaultProfile({ defaultProfile: res.body.defaultProfile });
            });
    }

    setProfiles(data) {
        this.dispatch(data);
    }

    setSelectedProfileIdx(data) {
        this.dispatch(data);
    }

    setDefaultProfile(data) {
        this.dispatch(data);
    }
}

module.exports = alt.createActions(TempProfileActions);
