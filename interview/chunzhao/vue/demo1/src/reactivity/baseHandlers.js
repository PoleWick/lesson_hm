import { track, trigger } from './effect'
// 代理对象的拦截操作
// get obj, key  effect -> track  依赖地图中

function createGetter() {
  // 可读性
  return function get(target, key, receiver) {
    // console.log(target, key, receiver, '-------------');
    // 收集依赖
    track(target, "get", key);
    return target[key];
  }
}
function createSetter() {
  return function set(target, key, value, receiver) {
    console.log('--------------', target, key);
    const result = Reflect.set(target, key, value, receiver);
    trigger(target, "set", key);
    return result
  }
}

const get = createGetter();
const set = createSetter();

export const mutableHandlers = {
  // 拦截那些行为
  get,
  set
}