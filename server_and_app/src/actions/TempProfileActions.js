import alt from '../alt';
import request from 'superagent';
import { move } from '../utilities';

class TempProfileActions {
    fetchProfiles() {
        this.dispatch();

        request
            .get('/api/profiles')
            .end((err, res) => {
                let profiles = res.body.profiles;
                let defaultIdx = profiles.map( profile => {
                    return profile.name
                }).indexOf(res.body.defaultProfile);

                // Make default profile first in list of profiles
                profiles = move(profiles, defaultIdx, 0);
                defaultIdx = 0;

                this.actions.setProfiles({ profiles: profiles });
                //this.actions.setSelectedProfileIdx({ selectedProfileIdx: defaultIdx });
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
