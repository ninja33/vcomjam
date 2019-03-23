class VCOMData {
    constructor() {
        $.couch.urlPrefix = "http://localhost:5984";
        this.databasename = "test";
        this.viewname = "vcom/matches";
    }

    async getToken() {
        let vcombase = 'https://cors-anywhere.herokuapp.com/https://api.vocab.com/1.0';
        return new Promise((resolve, reject) => {
            $.ajax({
                url: vcombase + '/auth/token',
                type: 'POST',
                success: (data) => resolve(data),
                error: (xhr, status, err) => resolve(null),
            });
        });
    }

    async getJamResult(token, num) {
        let vcombase = 'https://cors-anywhere.herokuapp.com/https://api.vocab.com/1.0';
        return new Promise((resolve, reject) => {
            $.ajax({
                url: vcombase + '/jam/' + num,
                type: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token.access_token}`
                },
                success: (data) => resolve(data),
                error: (xhr, status, err) => resolve(null),
            });
        });
    }

    async loadVcomJams(jams) {
        let token = await this.getToken();
        if (token) {
            let promises = jams.map((jam) => this.getJamResult(token, jam));
            let results = await Promise.all(promises);
            return VCOMData.buildMatches(results.filter(x => x != null));
        } else {
            return null;
        }
    }

    async convertJSONtoDB() {
        return new Promise((resolve, reject) => {
            try {
                $.getJSON('data/vcom.json', function(docs) {
                    for (const doc of docs) doc._id = doc.now.toString();
                    $.couch.db(this.databasename).bulkSave({ "docs": docs }, {
                        success: resolve(data),
                        error: (status, error, reason) => reject({ status, error, reason })
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static buildMatches(results) {
        let matches = [];
        for (const result of results) {
            let dashboard = {};
            let words = [];
            for (const member of result.members) {
                if (member.turn < 0) continue;
                dashboard[member.mid] = { nickname: member.nickname.replace("Anonymous", "(A)"), totalpoints: member.points, turnpoints: [] };
            }
            for (const [index, turn] of result.turns.entries()) {
                words[index] = { word: turn.word.word, pos: turn.word.pos, def: turn.word.def };
                for (const memberid in dashboard)
                    dashboard[memberid].turnpoints[index] = 0;
                for (const answer of turn.answers) {
                    dashboard[answer.who].turnpoints[index] = answer.points;
                }
            }
            matches.push({ datetime: new Date(Number(result.now)), title: result.name, dashboard, words });
        }
        return matches;
    }

    async loadJSONfile() {
        return new Promise((resolve, reject) => {
            try {
                $.getJSON('data/vcom.json', results => resolve(VCOMData.buildMatches(results)));
            } catch (error) {
                reject(error);
            }
        });
    }


    async loadDatabase() {
        return new Promise((resolve, reject) => {
            $.couch.db(this.databasename).view(this.viewname, {
                success: data => {
                    let matches = [];
                    for (const row of data.rows) {
                        matches.push({
                            datetime: new Date(Number(row.key)),
                            title: row.value.title,
                            dashboard: row.value.dashboard,
                            words: row.value.words
                        });
                    }
                    resolve(matches);
                },
                error: (status, error, reason) => reject({ status, error, reason }),
                reduce: false
            });
        });
    }

    async saveDatabase(lines) {
        return new Promise((resolve, reject) => {
            try {
                for (const line of lines) {
                    let doc = JSON.parse(line);
                    if (!doc.now || !doc.members || !doc.turns) continue;
                    doc._id = doc.now.toString();
                    $.couch.db(this.databasename).saveDoc(doc, {
                        success: console.log(data),
                        error: reject(err + ":" + reason)
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    }
}