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

    cursor.execute('CREATE TABLE IF NOT EXISTS matchs(mid INTEGER NOT NULL, msn INTEGER, code INTEGER, listid INTEGER, listname INTEGER, datetime TEXT, PRIMARY KEY(mid))')
    cursor.execute('CREATE TABLE IF NOT EXISTS turns(tid INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, tsn INTEGER, mid INTEGER, word TEXT, pos TEXT, def TEXT, FOREIGN KEY(mid) REFERENCES matchs(mid))')
    cursor.execute('CREATE TABLE IF NOT EXISTS users(uid TEXT NOT NULL, nickname TEXT NOT NULL, PRIMARY KEY(uid))')
    cursor.execute('CREATE TABLE IF NOT EXISTS answers(aid INTEGER NOT NULL, uid TEXT, tid INTEGER, elapsed INTEGER, correct INTEGER, points INTEGER, PRIMARY KEY(aid), FOREIGN KEY(uid) REFERENCES users(uid), FOREIGN KEY(tid) REFERENCES turns(tid))')

    for line in load_vcomdata(path):
        data = json.loads(line)
        cursor.execute('INSERT INTO matchs VALUES(?, ?, ?, ?, ?, ?)', (data['now'], data['sn'], data['code'], data['listid'], data['name'], data['now']))
        mid = cursor.lastrowid
        for member in data['members']:
            if member['claimed'] == True:
                if cursor.execute("""SELECT EXISTS (SELECT 1 FROM users WHERE uid=?LIMIT 1)""", (member['uid'], )).fetchone()[0] > 0:
                    cursor.execute('UPDATE users SET nickname=? WHERE uid=?', (member['nickname'], member['uid']))
                else:
                    cursor.execute('INSERT INTO users VALUES(?, ?)', (member['uid'], member['nickname']))
        for idx, turn in enumerate(data['turns']):
            cursor.execute('INSERT INTO turns (tsn, mid, word, pos, def) VALUES(?, ?, ?, ?, ?)', (idx, mid, turn['word']['word'], turn['word']['pos'], turn['word']['def']))
            tid = cursor.lastrowid
            for answer in turn['answers']:
                users = [x for x in data['members'] if x['mid'] == answer['who'] and x['claimed'] == True]
                for user in users:
                    cursor.execute('INSERT INTO answers (uid, tid, elapsed, correct, points) VALUES(?, ?, ?, ?, ?)', (user['uid'], tid, answer['elapsed'], answer['correct'], answer['points']))


def build_db_sqlite(db_path, vcomdata_path):

    data_path = os.path.join(os.path.abspath("."), 'data')
    db_path = os.path.join(data_path, db_path)
    vcomdata_path = os.path.join(data_path, vcomdata_path)
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
