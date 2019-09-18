export default [
  {
    name:'num2px',
    methods:(val)=>{
        if(val.indexOf('px')==-1)return val+'px'
        return val
   }
  }
]
