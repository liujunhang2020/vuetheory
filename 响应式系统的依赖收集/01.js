// 创建订阅者Dep，主要作用是用来存放观察者对象
class Dep {

  constructor() {
    // 用来存放观察者对象的数组
    this.subs = [];
  }
  // 用来在subs中添加一个观察者watcher对象
  addSub(sub) {
    this.subs.push(sub)
  }

  // 通知所有的Watcher对象更新视图
  notify() {
    this.subs.forEach(sub => {
      sub.update() // 调用watcher的update方法更新视图
    })
  }
}

// 创建一个watcher类，表示观察者
class Watcher {
  constructor() {
    // 将当前的对象赋值给Dep.target 
    Dep.target = this;
  }
  update() {
    console.log('更新视图......')
  }
}

function defineReactive(obj, key, val) {
  // 创建一个订阅者对象
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      // 将观察者添加到订阅者列表
      dep.addSub(Dep.target);
      return val;
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      val = newVal;
      dep.notify(); // 通知各个观察者更新视图
    }
  })
}

function observe(value) {
  if (!value || (typeof value !== 'object')) {
    return;
  }
  Object.keys(value).forEach(key => {
    defineReactive(value, key, value[key])
  })
}

class Vue {
  constructor(options) {
    this._data = options.data; 
    observe(this._data);
    // 创建一个观察者
    new Watcher(); // 此时创建的这个观察者就被保存在了Dep.target中
    // 模拟render的过程，为了触发test属性的get函数
    console.log('render~~', this._data.test)
  }
}

// 测试
let vm = new Vue({
  data: {
    test: "aaaa"
  }
})
vm._data.test = "bbbb"

Dep.target = null; 