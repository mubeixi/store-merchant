import Area from './tool/area.js'
export class City {

  static getProvinceList = ()=>{
    let rt = Area.map(item=>{
      return item.name
    })
    return rt
  }

  static getCityList = (pName)=>{
    let citys = []
    for(var province of Area){
      if(province.name === pName){
        citys = province.city
      }
    }

    let rt = citys.map(city=>{
      return city.name
    })
    return rt
  }

  static getAreaList = (pName,cName)=>{

    let citys = []
    for(var province of Area){
      if(province.name === pName){
        citys = province.city
      }
    }

    let cityInfo = null
    for(var city of citys){
      if(city.name === cName){
        cityInfo = city
      }
    }
    console.log(cityInfo)

    let rt = cityInfo.districtAndCounty

    return rt
  }

}
