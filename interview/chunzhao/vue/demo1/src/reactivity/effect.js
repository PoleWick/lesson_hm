let activeEffect = null; // 当前effect
const targetMap = new WeakMap(); // 弱引用 依赖收集 ？ 当前对象的依赖

// effect 函数
export function effect(fn) {
    const effectFn = () => {
        try {
            activeEffect = effectFn;
            return fn(); // 依赖得以收集
        } finally {
            activeEffect = null;
        }
    };
    effectFn(); // 立即执行副作用函数
    return effectFn; // 返回副作用函数以便后续调用
}

// track 函数
export function track(target, type, key) {
    if (!activeEffect) return; // 如果没有活跃的副作用函数，则不需要追踪依赖
    
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map(); // 初始化一个新的 Map
        targetMap.set(target, depsMap); // 将新的 Map 存入 targetMap
    }
    
    let deps = depsMap.get(key);
    if (!deps) {
        deps = new Set(); // 初始化一个新的 Set
        depsMap.set(key, deps); // 将新的 Set 存入 depsMap
    }
    
    if (!deps.has(activeEffect)) {
        deps.add(activeEffect); // 添加当前活跃的副作用函数到依赖集合中
    }
}

// trigger 函数
export function trigger(target, type, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;

    const effects = new Set();
    const computedRunners = new Set();

    if (key !== undefined) {
        let deps = depsMap.get(key);
        deps && deps.forEach(effect => {
            if (effect !== activeEffect) { // 避免递归触发自身
                effects.add(effect);
            }
        });
    }

    effects.forEach(effectFn => effectFn()); // 触发所有相关副作用函数重新执行
}

// 创建响应式对象
export function reactive(target) {
    return createReactiveObject(target, targetMap);
}

function createReactiveObject(target, proxyMap) {
    if (typeof target !== 'object' || target === null) {
        console.warn('reactive 必须是一个对象');
        return target;
    }

    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
        return existingProxy; // 已经存在，直接返回
    }

    const handler = {
        get(obj, prop, receiver) {
            const result = Reflect.get(obj, prop, receiver);
            track(obj, 'get', prop); // 收集依赖
            return typeof result === 'object' && result !== null ? reactive(result) : result;
        },
        set(obj, prop, value, receiver) {
            const oldValue = obj[prop];
            const result = Reflect.set(obj, prop, value, receiver);
            if (oldValue !== value) {
                trigger(obj, 'set', prop); // 触发更新
            }
            return result;
        }
    };

    const proxy = new Proxy(target, handler);
    proxyMap.set(target, proxy);
    return proxy;
}