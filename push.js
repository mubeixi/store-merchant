// 局部模式
const shell = require('shelljs');
// 全局模式下，就不需要用shell开头了。
// require('shelljs/global');

if (shell.exec('npm run build').code !== 0) { // 执行npm run build 命令
  shell.echo('Error: Git commit failed');
  shell.exit(1);
}


shell.exec('git pull origin master');

// 由于我的用另外一个仓库存放dist目录，所以这里要将文件增量复制到目标目录。并切换到对应目录。
shell.cp('-r', './dist/*', '../shop-diy-dist/htdocs/member/shop/setting/diy');
shell.cd('../shop-diy-dist');

// 不能在一股脑全部添加了
shell.exec('git add htdocs/member/shop/setting/diy/');
shell.exec('git commit -m autopush');
shell.exec('git push origin master');
