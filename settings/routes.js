import db from './db.js';
import { hashPassword, comparePassword } from './passwordCheck.js';

export default function router(app) {
  app.get('/', (req, res) => {
    res.render('index.ejs', { name: 'Max' });
  });

  app.post('/auth', (req, res) => {
    const { username, password } = req.body;
    (async () => {
      const hash = await hashPassword(password);
      db.query(
        'INSERT INTO `users` (`login`, `password`) VALUES ("' + username + '", "' + hash + '")  ',
      );
    })();

    res.json('Success');
  });

  app.post('/login', (req, res) => {
    db.query(
      "SELECT `login`, `password` FROM `users` WHERE `login` = '" + req.body.username + "'",
      (err, rows, fields) => {
        if (err) {
          res.send('Error');
        } else if (rows.length <= 0) {
          res.send('Username not found');
        } else {
          const row = JSON.parse(JSON.stringify(rows));
          row.map((r) => {
            (async () => {
              const hash = r.password;
              const isValidPass = await comparePassword(req.body.password, hash);
              console.log(`Password is ${!isValidPass ? 'not' : ''} valid!`);
            })();
          });
        }
      },
    );
  });

  app.get('/disp', (req, res) => {
    db.query('SELECT * FROM `disp`', (err, rows, fields) => {
      if (rows != undefined) {
        // const disps = [...new Array.from(rows, ({ disp_name }) => disp_name)];
        // const disps = Array.from(rows, ({ disp_name }) => disp_name);
        res.send(rows);
      }
    });
  });

  app.get('/:disp', (req, res) => {
    const disp = req.params.disp;
    const city = disp === 'bln4' || disp === 'lps' ? 'nch_complex' : 'all_streets';
    db.query(
      'SELECT * FROM `' + city + '` WHERE `' + disp + '` = 1 ORDER BY `street_name` ASC',
      (err, rows, fields) => {
        if (rows != undefined) {
          // const streets = [...new Set(Array.from(rows, ({ street }) => street))];

          res.send(rows);
        }
      },
    );
  });

  app.get('/:disp/:street', (req, res) => {
    const disp = req.params.disp;
    const city = disp === 'bln4' || disp === 'lps' ? 'nch_complex' : 'all_streets';
    const street = req.params.street;

    db.query(
      'SELECT `street_house`, `house_id` FROM `' +
        city +
        '` RIGHT JOIN `' +
        disp +
        '` ON `street_name` = `street` WHERE `' +
        disp +
        '` = 1 AND `eng_name` = "' +
        street +
        '"',
      // 'SELECT * FROM `' + disp + '` WHERE `street` = "' + street + '" ORDER BY `street_house` ASC',
      (err, rows, fields) => {
        if (rows != undefined) {
          const indexes = [...new Set(Array.from(rows, ({ house_id }) => house_id))];
          const houses = [...new Set(Array.from(rows, ({ street_house }) => street_house))];
          let filteredHouses = [];
          for (let i = 0; i < indexes.length; i++) {
            filteredHouses[i] = { house_id: indexes[i], street_house: houses[i] };
          }
          res.send(filteredHouses);
        }
      },
    );
  });

  app.get('/:disp/:street/:house', (req, res) => {
    const disp = req.params.disp;
    const city = disp === 'bln4' || disp === 'lps' ? 'nch_complex' : 'all_streets';
    const street = req.params.street;
    const house = req.params.house;
    db.query(
      'SELECT * FROM `' +
        disp +
        '` RIGHT JOIN `' +
        city +
        '` ON `street` = `street_name` WHERE `eng_name` = "' +
        street +
        '" AND `street_house` = "' +
        house +
        '" ORDER BY `podezd`',
      (err, rows, fields) => {
        if (rows != undefined) {
          res.send(rows);
        }
      },
    );
  });

  app.get('/:disp/:street/:house/:id', (req, res) => {
    const disp = req.params.disp;
    const id = req.params.id;
    db.query('SELECT * FROM `' + disp + '` WHERE `id` = "' + id + '"', (err, rows, fields) => {
      if (rows != undefined) {
        res.send(rows);
        console.log(rows);
      }
    });
  });
}
