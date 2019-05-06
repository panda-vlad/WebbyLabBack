const mongoose = require('mongoose');
const fs = require('fs');

const filmsValidator = require('../../validators/film')
const Films = require('../../models/Films')

const title = [];
const release = [];
const format = [];
const stars = [];


const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};


const app = router => {
  // @route Get /test
  // @ desc Get test
  router.get('/test', (req, res) => res.json({msg: "Welcome in Rest API"}));


  // @route Get /film/:name
  // @ desc Get information about film by name
  router.get('/film/:name', (req, res) => {
    console.log(' response ' + req.params.name);
    if(req.params.name.length === 0)
      if (err) res.status(400).json({msg: 'Can not be blank'});
    Films
    .find({
      'name': { '$regex': req.params.name, '$options': 'i'}
    })
    .exec((err, response) =>{
      if (err) res.status(500).json({msg: 'Some thing with database'});

      res.status(200).json(response);
    })
  });

  // @route Get /actor/:name
  // @desc  Get all films with actor
  router.get('/actor/:name', (req, res) => {
    Films
    .find({
      'starting': { '$regex': req.params.name, '$options': 'i'}
    })
    .exec((err, response) => {
      if (err) res.status(500).json({msg: 'Some thing with database'});

      res.status(200).json(response);
    })
  })

  // @route Get /info
  // @desc  Get sort  (desc) list of films
  router.get('/desc', (req, res) => {
    Films
    .find({})
    .sort({name: -1})
    .exec((err, response) => {
      if (err) res.status(500).json({msg: 'Some thing with database'});
      res.status(200).json(response);
    })
  })

  router.get('/asc', (req, res) => {
    Films
    .find({})
    .sort({name: 1})
    .exec((err, response) => {
      if (err) res.status(500).json({msg: 'Some thing with database'});
      res.status(200).json(response);
    })
  })

  router.post('/add', (req, res) => {
    if(!req.body.name) {
      return res.status(400).json({msg: 'Film must have name'})
    }
    Films
    .findOne({name: req.body.name})
    .then(film => {
      if (!film) {
        const {errors, isValid } = filmsValidator(req.body);

        if(!isValid) {
          return res.json(errors)
        }
        const newFilm = new Films({
          _id: new mongoose.Types.ObjectId(),
          name: toTitleCase(req.body.name),
          release: parseInt(req.body.release),
          format: req.body.format,
          starting: req.body.starting.split(', ')
        });
        newFilm.save((err) => {
          if (err) return res.status(500).json({msg: 'Can not bee save'})
        })
        res.status(200).json({msg: 'Film was saved', name: newFilm.name, id: newFilm._id})
      }
      else  res.json({msg: 'Film already exist'})
    })

  });


  // @route POST /upload
  // @desc  post films from file to database
  router.post('/upload', function(req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files)
      return res.status(400).send('No files were uploaded.');


    if(req.files.sampleFile.mimetype != 'text/plain')
      return res.status(400).json({msg: 'Not correct data type'})

    sampleFile = req.files.sampleFile;
	
    if(!fs.existsSync(__dirname + '/uploads'))
      fs.mkdirSync(__dirname + '/uploads')

    uploadPath = __dirname + '/uploads/' + sampleFile.name;

    sampleFile.mv(uploadPath, function(err) {
      if (err) {
        return res.status(500).send(err);
      }

      const data = req.files.sampleFile.data.toString('ascii');

      const dataArr = data.split('\n')

      for(let i = 0; i < dataArr.length; i++) {
        if(dataArr[i] === '') continue; // delete empty

      if(dataArr[i].split(': ')[0] === 'Title')
        title.push(dataArr[i].split(': ')[1])

      if(dataArr[i].split(': ')[0] === 'Release Year')
        release.push(dataArr[i].split(': ')[1])

      if(dataArr[i].split(': ')[0] === 'Format')
        format.push(dataArr[i].split(': ')[1])

      if(dataArr[i].split(': ')[0] === 'Stars')
        stars.push(dataArr[i].split(': ')[1])

      }

      for(let i = 0; i < title.length; i++) {
        if(title[i] === '') {
          return res.status(400).json({msg: 'Film must have name'})
        }
        Films
        .findOne({name: title[i]})
        .then(film => {
          if(!film) {
            const newFilm = new Films({
              _id: new mongoose.Types.ObjectId(),
              name: title[i],
              release: release[i],
              format: format[i],
              starting: stars[i].split(', ')
            });
            newFilm.save(err => {
              if (err) return res.status(500).json({msg: 'Can not bee save'});
            })
          }
          else {
            return res.status(400).json({msg: 'Film already exist' + title[i]})
          }
        })
      }
      fs.unlink(uploadPath, (err) =>{
        if (err) console.log(err);
      })
      return res.status(200).json({msg: 'File was upload'});
    });
  });

  // @route DELETE /delete/:id
  // @desc  Delete film by id
  router.delete('/delete/:id', (req, res) => {
    Films.findByIdAndRemove(req.params.id, (err, response) =>{
      if (err) return res.status(500);
      return res.status(200).json({msg: 'Film was deleted'});
    });
  });

}

module.exports = app;
