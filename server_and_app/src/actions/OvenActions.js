import alt from '../alt';
import request from 'superagent';

class OvenActions {
    fetchOvenState() {
        this.dispatch();

        request
            .get('/api/ovensim')
            .end((err, res) => {
                this.actions.setOvenOn({ ovenOn: res.body.ovenOn });
            });
    }

    setOvenOn(data) {
        this.dispatch(data);
    }
}

module.exports = alt.createActions(OvenActions);
