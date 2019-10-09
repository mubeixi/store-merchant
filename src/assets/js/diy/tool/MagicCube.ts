//魔方类
import {arrayUnique} from "@/common/utils";

const plane_contact_plane = (check: { x: number; y: number, x1: number, y1: number }, plane: Object, full: Boolean = false): boolean => {


  var {x: left, y1: bottom, x1: right, y: top} = check;
  let domA = {left, bottom, right, top};

  // @ts-ignore
  var {x: left, y1: bottom, x1: right, y: top} = plane;
  let domB = {left, bottom, right, top};

  if (domA.left >= domB.right || domA.top >= domB.bottom || domA.right <= domB.left || domA.bottom <= domB.top) {
    return false // 未碰撞
  } else {
    return true // 碰撞
  }

}

/**
 * 输入数组和指定矩形，返回这个元素左和上有几个缝隙。
 * @param areaList 整个界面的数组
 * @param area 对应的矩形
 */
export const getRowColSpan = (areaList:object,area:object)=>{
  let y1arr = areaList.map(areaItem=>{
    return areaItem.y1;
  })

  //得到所有不同y的值
  let yarr = arrayUnique(y1arr)

  let x1arr = areaList.map(areaItem=>{
    return areaItem.x1;
  })

  //得到所有不同y的值
  let xarr = arrayUnique(x1arr)

  //加入横竖各有有四个方块，则各需要3个缝隙（只计算区块之间的缝隙即可)。

  return {rownum:yarr.length-1>=0?yarr.length-1:0,colnum:xarr.length-1>=0?xarr.length-1:0}

}


/**
 * 面有某个点在另一个面里面,需要看四个点
 * @param point
 * @param plane
 * @param full 是否要求所有点都在面里面（检测新建区域在画布内用full=1,其他的只要有一个点在就行了)
 */
const plane_in_plane = (check: { x: number; y: number, x1: number, y1: number }, plane: Object, full: Boolean = false): boolean => {
  console.log(check, plane);


  var {x: left, y1: bottom, x1: right, y: top} = check;
  let domA = {left, bottom, right, top};

  // @ts-ignore
  var {x: left, y1: bottom, x1: right, y: top} = plane;
  let domB = {left, bottom, right, top};


  //允许边缘在一起
  if (full) {
    if (domA.left >= domB.right || domA.top >= domB.bottom || domA.right <= domB.left || domA.bottom <= domB.top) {
      return false // 未碰撞
    } else {
      return true // 碰撞
    }
  }


  //不允许边缘在一起
  if (domA.left > domB.right || domA.top > domB.bottom || domA.right < domB.left || domA.bottom < domB.top) {
    return false // 未碰撞
  } else {
    return true // 碰撞
  }


}

/**
 * 计算矩形面积
 * @param area
 */
const countArea = (area:object)=>{

  // @ts-ignore
  let { x, y, x1, y1} = area;
  return (y1-y) * (x1-x)
}


class MagicCube {

  row: Number;
  col:Number;
  width: Number;
  height:Number;

  tmpl = {x: 0, y: 0, x2: 0, y2: 0};//模板，用四个角标来记录每个选中的区域
  selects = [];
  base: Object;

  //记录已经选择的热区

  constructor(row: number = 5,col: number = 5, w: number = 750,h: number = 750,selecteds = []) {
    this.row = row;
    this.col = col;
    this.height = h;
    this.width = w;
    //this.selects = selecteds;//初始化选择的数据
    this.base = {x: 0, y: 0, x1: col, y1: row}
  }

  set_row(row: number) {
    this.row = row;
  }

  get_selects() {
    return this.selects;
  }


  /**
   * 检查已用面积是不是小于总面积，这样可以检测是否铺满
   */
  is_full(){
    // @ts-ignore
    let areaCount = 0 ,fullAreaCount = this.row * this.col;

    for(var area of this.selects){
      areaCount += countArea(area)
    }
    console.log(areaCount,fullAreaCount);

    return areaCount === fullAreaCount;


  }

  /**
   * 加入区域到选择列表中
   * @param area
   */
  add_selects(area: object) {
    try {
      this.selects.push(area)
      console.info('创建画布成功')
    } catch (e) {
      throw '添加画布失败';
    }


  }

  /**
   * 删除某个选中的
   * @param area
   */
  del_selects(area: object) {

    let idx = null;
    for (var i in this.selects) {
      if (JSON.stringify(this.selects[i]) === JSON.stringify(area)) {
        idx = i;
        break;
      }
    }

    if (idx === null) return false;

    this.selects.splice(idx, 1);

    return true;

  }


  create_area(x: number, y: number, x1: number, y1: number) {

    //有冲突就返回
    if (this.is_conflict({x, y, x1, y1})) {
      console.warn('创建画布失败');
      return false;
    }

    let IDX = this.selects.length;//每个人选择下标作为index
    //加入列表,错误会报错终止运行
    this.add_selects({x, y, x1, y1, IDX});

    return true;

  }

  /**
   *检测四个点是否符合创建热区的要求。1：不能超出边界 2.不能和已有的热区冲突.
   * point_in_plane 这个函数可以一直用，四个定点和所有边界进行比较， 和边界比较比较时，需要四个点都在里面  和已有区域比较，需要所有点都不在。
   * @param x
   * @param y
   * @param x1
   * @param y1
   * @return boolean
   */
  is_conflict(creat: { x: number, y: number, x1: number, y1: number }): boolean {

    let is_in_wrap = plane_in_plane(creat, this.base, true);

    if (!is_in_wrap) {
      console.log("超出画布范围");
      return true;
    }


    for (var area of this.selects) {
      console.log(area)
      //有一个冲突就不行
      if (plane_in_plane(creat, area, true)) {
        console.log("与现有画布冲突", creat, area);
        return true;
      }
    }


    return false;


  }


}


export default MagicCube;
