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

                this.actions.setProfiles({ profiles: profiles });
                this.actions.setDefaultProfileName({ defaultProfileName: res.body.defaultProfile });
            });
    }

    setProfiles(data) {
        this.dispatch(data);
    }

    deleteProfile(data) {
        this.dispatch();

        request
            .del('/api/profiles/' + data.profile.name)
            .end( (err, res) => {
                console.log('deleted profile: ', data.profile.name);
                console.log('error: ', err);
                console.log('response: ', res);

                this.actions.profileDeleted(data);
                this.actions.fetchProfiles();
            });
    }

    profileDeleted(data) {
        this.dispatch(data);
    }

    setDefaultProfileName(data) {
        this.dispatch(data);
    }
}

module.exports = alt.createActions(TempProfileActions);
