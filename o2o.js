// @ts-nocheck

// 局部模式
const shell = require('shelljs');
// 全局模式下，就不需要用shell开头了。
// require('shelljs/global');

shell.exec('git pull origin master');
//
if (shell.exec('npm run build').code !== 0) { // 执行npm run build 命令
  shell.echo('Error: Git commit failed');
  shell.exit(1);
}

// 不能在一股脑全部添加了
const options = {
  host: '47.93.84.174',
  port: '21',
  user: 'newo2osrc',
  password: 'Wzw123456!#',
  // proxy:{
  //   host: '',
  //   port: '',
  // }
};


const FtpDeploy = require('ftp-deploy');

const ftpDeploy = new FtpDeploy();

const config = {
  ...options,
  localRoot: `${__dirname}/dist`,
  remoteRoot: '/member/shop/setting/diy/',
  include: ['*', '**/*'], // this would upload everything except dot files
  // include: ["*.php", "dist/*", ".*"],
  // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
  // exclude: ["dist/**/*.map", "node_modules/**", "node_modules/**/.*", ".git/**"],
  exclude: ['static/fonts/**'],
  // delete ALL existing files at destination before uploading, if true
  deleteRemote: true,
  // Passive mode is forced (EPSV command is not sent)
  forcePasv: false,
};

// use with promises
// ftpDeploy
//   .deploy(config)
//   .then(res => console.log('finished:', res))
//   .catch(err => {
//     let { message, name } = err;
//     console.log({
//       name,
//       message
//     });
//   });

// use with callback
ftpDeploy.deploy(config, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log('finished:', res);
    process.exit();
  }
});

ftpDeploy.on('uploading', (data) => {
  // console.log(data.totalFilesCount); // total file count being transferred
  // console.log(data.transferredFileCount); // number of files transferred
  // console.log(`start up ${data.filename} ，fileSize ${data.totalFilesCount}`); // partial path with filename being uploaded
});
ftpDeploy.on('uploaded', (data) => {
  console.log('\033[33m ' + data.filename + ' upload done \033[39m'); // same data as uploading event
});
ftpDeploy.on('log', (data) => {
  // console.log(data); // same data as uploading event
});
ftpDeploy.on('upload-error', (data) => {
  console.log(data.err); // data will also include filename, relativePath, and other goodies
});
