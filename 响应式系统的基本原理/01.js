/**
 * vue2 主要依靠 definePropery来实现响应式原理
 * 
 * obj: 目标对象
 * prop: 需要操作的目标对象的属性名
 * descriptor: 描述符
 * return value 传入的对象
 * 
 * Object.defineProperty(obj,prop,descriptor) 
 * 
 * 其他一些常用属性介绍：
 * enumerable: 属性是否可枚举、默认为false
 * configurable: 属性是否可以被修改或者删除、默认为false
 * get 获取属性的方法
 * set 设置属性的方法
*/


// 模拟不考虑复杂数据的情况，以对象为基础

// 定义一个函数来模拟视图更新，一旦调用了这个函数就表示更新视图
function cb() {
  // 模拟渲染视图
  console.log('视图更新......')
}

// 定义函数 defineReactive ,通过Object.defineProperty实现对数据的响应式化处理
/**
 * obj 需要绑定的对象
 * key obj 的某个属性
 * value 具体的值
*/
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true, 
    configurable: true, 
    get: function() { // 读数据的时候触发
      return val; /*实际上会进行依赖收集，先跳过*/
    },
    set: function(newVal) { // 写数据的时候触发
      if (newVal === val) return; 
      cb(newVal)
    }
  })
}

/**
 * value 需要响应式化处理的对象
*/
// vue实际的源码中其实是进行递归，这一部分为了便于理解省略
function observe(value) {
  if (!value || (typeof value != 'object')) {
    return 
  }
//通过遍历所有属性的方式对该对象的每一个属性都通过 defineReactive 处理。
  Object.keys(value).forEach(key => {
    defineReactive(value, key, value[key]);
  })
}


// 最后通过observe 来封装一个vue
class Vue {
  // vue 的构造类
  constructor(options) { // 对options里面的data进行处理
    this._data = options.data 
    observe(this._data)
  } 
}

// 测试 
const vm = new Vue({
  data: {
    test: 'Hello,World!'
  }
})

// 对数据进行更新
vm._data.test = 'My name is test'