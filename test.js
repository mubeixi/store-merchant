// @ts-nocheck

// 局部模式
const shell = require('shelljs');
// 全局模式下，就不需要用shell开头了。
// require('shelljs/global');

// if (shell.exec('npm run buildtest').code !== 0) { // 执行npm run build 命令
//   shell.echo('Error: Git commit failed');
//   shell.exit(1);
// }

// 不能在一股脑全部添加了
const options = {
  host: '47.93.84.174',
  port: '21',
  user: 'btcs401',
  password: 'Wzw123456!#',
};

let FtpDeploy = require('ftp-deploy');
let ftpDeploy = new FtpDeploy();

let config = {
  ...options,
  localRoot: __dirname + '/dist',
  remoteRoot: '/',
  include: ['*', '**/*'], // this would upload everything except dot files
  // include: ["*.php", "dist/*", ".*"],
  // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
  // exclude: ["dist/**/*.map", "node_modules/**", "node_modules/**/.*", ".git/**"],
  exclude: ['static/kindeditor/**'],
  // delete ALL existing files at destination before uploading, if true
  deleteRemote: false,
  // Passive mode is forced (EPSV command is not sent)
  forcePasv: false,
};

// use with promises
ftpDeploy
  .deploy(config)
  .then(res => console.log('finished:', res))
  .catch(err => {
    let { message, name } = err;
    console.log({
      name,
      message
    });
  });

// use with callback
ftpDeploy.deploy(config, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    
    console.log('finished:', res);
    process.exit()
  }
});

ftpDeploy.on('uploading', function(data) {
  // console.log(data.totalFilesCount); // total file count being transferred
  // console.log(data.transferredFileCount); // number of files transferred
  // console.log(`start up ${data.filename} ，fileSize ${data.totalFilesCount}`); // partial path with filename being uploaded
});
ftpDeploy.on('uploaded', function(data) {
  console.log('\033[33m '+data.filename+' upload done \033[39m'); // same data as uploading event
});
ftpDeploy.on('log', function(data) {
  // console.log(data); // same data as uploading event
});
ftpDeploy.on('upload-error', function(data) {
  console.log(data.err); // data will also include filename, relativePath, and other goodies
});

// var c= new ftpClient()
//
// c.connect(config);
//
// var walk = function(dir, done) {
//   var results = [];
//   fs.readdir(dir, function(err, list) {
//     if (err) return done(err);
//     var pending = list.length;
//     if (!pending) return done(null, results);
//     list.forEach(function(file) {
//       file = path.resolve(dir, file);
//       fs.stat(file, function(err, stat) {
//         if (stat && stat.isDirectory()) {
//           walk(file, function(err, res) {
//             results = results.concat(res);
//             if (!--pending) done(null, results);
//           });
//         } else {
//           results.push(file);
//           if (!--pending) done(null, results);
//         }
//       });
//     });
//   });
// };
//
// /**
//  * 貌似list会多循环  以后再改吧
//  * 感觉node速度不如shell快
//  */
// c.on('ready', function() {
//   c.list(function(err, list) {
//     if (err) throw err;
//
//     const tpath = path.resolve(__dirname, '..') + '/shop-diy/dist';
//
//     walk(tpath, function(err, results) {
//       if (err) throw err;
//       results.forEach(function(filename) {
//         console.log(filename);
//         (function(filename) {
//           'use strict';
//           var spath = filename.replace(/F:\\qindao\\shop-diy\\dist\\/g, '');
//           c.put(filename, spath, function(err) {
//             if (err) throw err;
//             console.dir('上传文件' + spath);
//             c.end();
//           });
//         })(filename);
//       });
//     });
//   });
// });


//
// shell.cd('./dist');
//
// let tempStr = ''
//
// // ftp
// tempStr = `ftp -i -n ${config.host}`;
// shell.exec(tempStr)
//
// tempStr = `open ${config.host} ${config.port}`;
// shell.exec(tempStr)
//
// tempStr = `user ${config.user} ${config.password}`;
// shell.exec(tempStr)
//
// shell.exec('binary')
// shell.exec('hash')
//
// shell.exec('prompt');
// shell.exec('mput *');// mput是指批量的上传文件
// shell.exec('bye');
//
//
// shell.echo('commit to ftp successfully');


// const data = {
//   amount_data: {
//     lists: [],
//     total: 0,
//     page: 0,
//     pageSize: 20,
//   },
//   order_data: {
//     lists: [],
//     total: 0,
//     page: 0,
//     pageSize: 20,
//   },
//   point_data: {
//     lists: [],
//     total: 0,
//     page: 0,
//     pageSize: 20,
//   },
// }
