const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const should = chai.should();
const Films = require('./models/Films.js')

chai.use(chaiHttp);

  describe('/GET test', () => {
      it('GET welcome messege', (done) => {
        chai.request(server)
            .get('/test')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('msg').eql('Welcome in Rest API')
              done();
            });
      });
  });

  describe('/POST film', () => {
  it('it should not POST a film without name field', (done) => {
    let film = {
      release: 1990,
      format: 'DVD',
      starting: 'firstActor, secondActor'
    }
    chai.request(server)
      .post('/add')
      .send(film)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Film must have name')
        done();
      });
  });
  it('it should POST a film ', (done) => {
    let film = {
      name: 'Newfilm',
      release: 2015,
      format: 'DVD',
      starting: 'firstActor, secondActor'
    }
    chai.request(server)
      .post('/add')
      .send(film)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Film was saved');
        res.body.should.have.property('name').eql('Newfilm');
        done();
      });
  });
  it('it should not POST a same film', (done) => {
    let film = {
      name: 'Newfilm',
      release: 2015,
      format: 'DVD',
      starting: 'firstActor, secondActor'
    }
    chai.request(server)
      .post('/add')
      .send(film)
      .end((err, res) => {

        res.body.should.be.a('object');
        res.body.should.have.property('msg').eql('Film already exist');

        done();
      });
  });
});


describe('/GET/film/:name', () => {
  it('it should GET a film by name', (done) => {
    let film = new Films({ name: "The Lord of the Rings", starting: "Jon Tolkien", release: 1954, format: 'DVD' });
    film.save((err, book) => {
      chai.request(server)
      .get('/film/' + film.name)
      .send(book)
      .end((err, res) => {
        res.should.have.status(200);
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('name').eql(film.name)
        res.body[0].should.have.property('release').eql(film.release)
        res.body[0].should.have.property('format').eql(film.format)
        res.body[0].should.have.property('starting').eql(film.starting)
        done();
      });
    });

  });
});


describe('/GET/actor/:name', () => {
  it('it should GET a film by actors name', (done) => {
    let film = new Films({ name: "newFilm23", starting: "actorNew", release: 1954, format: 'DVD' });
    film.save((err, book) => {
      chai.request(server)
      .get('/actor/' + film.starting)
      .send(book)
      .end((err, res) => {
        res.should.have.status(200);
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('name').eql(film.name)
        res.body[0].should.have.property('release').eql(film.release)
        res.body[0].should.have.property('format').eql(film.format)
        res.body[0].should.have.property('starting').eql(film.starting)
        done();
      });
    });

  });
});
