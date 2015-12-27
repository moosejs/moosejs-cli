var Utils = module.exports,
      Q = require('q');

Utils.fetchArchive = function fetchArchive(targetPath, archiveUrl) {
  var os = require('os');
  var fs = require('fs');
  var path = require('path');
  var unzip = require('unzip');
  var q = Q.defer();
  var log = require('cedar')();

  log.prefixes = {
  trace: 'TRACE: '.cyan,
  debug: 'DEBUG: '.magenta,
  log:   'LOG:   '.gray,
  info:  'INFO:  '.green,
  warn:  'WARN:  '.yellow,
  error: 'ERROR: '.red,
  fatal: 'FATAL: '.red
};

  // The folder name the project will be downloaded and extracted to
  var message = ['Downloading:'.bold, archiveUrl].join(' ');
  log.info(message);

  var tmpFolder = os.tmpdir();
  var tempZipFilePath = path.join(tmpFolder, 'moosejs-temp-' + new Date().getTime() + '.zip');


  var unzipRepo = function unzipRepo(fileName) {
    var readStream = fs.createReadStream(fileName);
    readStream.on('error', function(err) {
      log.debug(('unzipRepo readStream: ' + err).error);
      q.reject(err);
    });

    var writeStream = unzip.Extract({ path: targetPath });
    writeStream.on('close', function() {
      q.resolve();
    });
    writeStream.on('error', function(err) {
      log.debug(('unzipRepo writeStream: ' + err).error);
      q.reject(err);
    });
    readStream.pipe(writeStream);
  };

  var proxy = process.env.PROXY || process.env.http_proxy || null;
  var request = require('request');
  request({ url: archiveUrl, rejectUnauthorized: false, encoding: null, proxy: proxy }, function(err, res, body) {
    if(err) {
      // console.error('Error fetching:'.error.bold, archiveUrl, err);
      q.reject(err);
      return;
    }
    if(!res) {
      console.error('Invalid response:'.error.bold, archiveUrl);
      q.reject('Unable to fetch response: ' + archiveUrl);
      return;
    }
    if(res.statusCode !== 200) {
      if(res.statusCode === 404 || res.statusCode === 406) {
        console.error('Not found:'.error.bold, archiveUrl, '(' + res.statusCode + ')');
        console.error('Please verify the url and try again.'.error.bold);
      } else {
        console.error('Invalid response status:'.error.bold, archiveUrl, '(' + res.statusCode + ')');
      }
      q.reject(res);
      return;
    }
    try {
      fs.writeFileSync(tempZipFilePath, body);
      unzipRepo(tempZipFilePath);
    } catch(e) {
      log.debug('fetchArchive request write: ', e);
      q.reject(e);
    }
  });

  return q.promise;
};
