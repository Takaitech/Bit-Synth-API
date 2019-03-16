'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker')

const expect = chai.expect;

const should = chai.should();
chai.use(chaiHttp);


const { Preset } = require('../model/models');
const { TEST_DATABASE_URL } = require('../config');
const { closeServer, runServer, app } = require('../server');


function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting Database');
        mongoose.connection.dropDatabase()
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
};


function seedPresetData() {
  console.info('seeding thread post data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      title: faker.lorem.word(),
      designer: faker.name.firstName(),
      envelope: {
        attack: faker.random.number(),
        decay: faker.random.number(),
        sustain: faker.random.number(),
        release: faker.random.number()
      },
      portamento: faker.random.number(),
      volume: faker.random.number(),
      oscillators: [{
        oscillator: faker.random.word(),
        volume: faker.random.number(),
        width: faker.random.number()
      }]
		 });
    }
  return Preset.insertMany(seedData);
}



describe('threadPosts API resource', function() {



  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(){
    return seedPresetData();
  });

  afterEach(function(){
		return tearDownDb();
  });

  after(function() {
    return closeServer();
  });


  describe('GET ENDPOINTS', function() {

    it('should return all existing presets', function() {

      let res;
      return chai.request(app)
      Preset.get('/presets')
      .then(response => {
        res = response;
        res.should.have.status(200);
        res.body.should.have.lengthOf.at.least(1);
        console.log(res.body);
        return Preset.countDocuments();
      })
      .then(count => {
        res.body.should.have.lengthOf(count);
      })

    })
  })

  describe('POST ENDPOINTS', function() {

    it('should add a preset to database', function() {

      let newPreset ={
        title: faker.lorem.word(),
        designer: faker.name.firstName(),
        envelope: {
          attack: faker.random.number(),
          decay: faker.random.number(),
          sustain: faker.random.number(),
          release: faker.random.number()
        },
        portamento: faker.random.number(),
        volume: faker.random.number(),
        oscillators: [{
          oscillator: faker.random.word(),
          volume: faker.random.number(),
          width: faker.random.number()
        }]
  		 };

      let res;
      return chai.request(app)
        Preset.post('/preset')
        .send(newPost)
        .then(function (res){
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('title','designer','envelope','volume','ocillators')
          res.body.title.should.equal(newPreset.title);
          res.body.id.should.not.be.null;
          res.body.designer.should.equal(newPreset.designer);
          return Preset.findOne();
        })
        .then(preset => {
          preset.oscillators.should.be.a('array');
        })
    })
  })
})
