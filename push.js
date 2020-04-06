// 局部模式
const shell = require('shelljs');
// 全局模式下，就不需要用shell开头了。
// require('shelljs/global');

shell.exec('git pull origin master');

if (shell.exec('npm run build').code !== 0) { // 执行npm run build 命令
  shell.echo('Error: Git commit failed');
  shell.exit(1);
}


//shell.rm('-rf', '../shop-diy-dist/htdocs/member/shop/setting/diy/*');// 删除

// 由于我的用另外一个仓库存放dist目录，所以这里要将文件增量复制到目标目录。并切换到对应目录。
shell.cp('-r', './dist/*', '../shop-diy-dist/htdocs/member/shop/setting/diy');
shell.cd('../shop-diy-dist');

// eslint-disable-next-line import/no-extraneous-dependencies
const sd = require('silly-datetime');

const time = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
console.log(time);

// 不能在一股脑全部添加了
shell.exec('git add htdocs/member/shop/setting/diy/');
shell.exec(`git commit -m "商户端发布版本${time}"`);
shell.exec('git push origin master');
