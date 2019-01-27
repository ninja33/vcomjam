#!/usr/bin/env python

import codecs
import sqlite3
import json
import optparse
import os.path

def load_vcomdata(path):
    print('Loading "{0}"...'.format(path))
    with codecs.open(path, encoding='utf-8') as fp:
        return filter(lambda x: x and x[0] != '#', fp.read().splitlines())


def output_vcom_sqlite(cursor, path):
    cursor.execute(CREATE TABLE IF NOT EXISTS matchs(mid INTEGER NOT NULL, msn INTEGER, code INTEGER, listid INTEGER, listname INTEGER, datetime TEXT, PRIMARY KEY(mid)))
    cursor.execute(CREATE TABLE IF NOT EXISTS turns(tid INTEGER NOT NULL, tsn INTEGER, mid INTEGER, word TEXT, pos TEXT, def TEXT, PRIMARY KEY(tid), FOREIGN KEY(mid) REFERENCES matchs(mid)))
    cursor.execute(CREATE TABLE IF NOT EXISTS users(uid TEXT NOT NULL UNIQUE, nickname TEXT NOT NULL, PRIMARY KEY(uid)))
    cursor.execute(CREATE TABLE IF NOT EXISTS answers(aid INTEGER NOT NULL, uid INTEGER, tid INTEGER, elapsed INTEGER, correct INTEGER, point INTEGER, PRIMARY KEY(aid), FOREIGN KEY(uid) REFERENCES users(uid), FOREIGN KEY(tid) REFERENCES turns(tid)))

    for line in load_vcomdata(path):
        data = json.loads(line);
        cursor.execute('INSERT INTO matchs matchs(?, ?, ?, ?, ?)', (data.sn, data.code, data.listid, data.name, data.now))
        mid = cursor.lastrowid
        for member in data.members:
            if member.claimed == 'true':
                cursor.execute('INSERT INTO users VALUES(?, ?)', (member.uid, member.nickname))
        for idx, turn in enumerate(data.turns):
            cursor.execute('INSERT INTO users VALUES(?, ?, , ?, ?)', (idex, mid, turn.word.word, turn.word.pos, turn,word.def))
            tid = cursor.lastrowid
            for answer in turn.answers:
                user = filter(lambda x: x.mid == answer.who and x.claimed == 'ture', data.members)
                if user:
                    cursor.execute('INSERT INTO answers VALUES(?, ?, , ?, ?)', (user.uid, tid, answer.elapsed, answer.correct, answer.point))

def build_db_sqlite(db_path, vcomdata_path):
    os.remove(db_path)

    with sqlite3.connect(db_path) as db:
        cursor = db.cursor()
        output_vcom_sqlite(cursor, vcomdata_path)

def main():
    parser = optparse.OptionParser()
    parser.add_option('--vcomdata', dest='vcomdata')
    parser.add_option('--db', dest='db')

    options, args = parser.parse_args()

    if len(args) == 0 and options.db is not None:
        build_db_sqlite(options.db, options.vcomdata)
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
