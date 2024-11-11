def Merge(dict1, dict2):
    """
    合并两个字典，如果两个字典中有相同的键，则后者的值会覆盖前者的值。

    参数：
    dict1：要合并的第一个字典。
    dict2：要合并的第二个字典。

    返回值：
    一个新的字典，包含了 dict1 和 dict2 的所有键值对。
    """
    # 使用 ** 操作符将字典 dict2 和 dict2 合并成一个新的字典
    res = {**dict1, **dict2}
    return res

# js 对象字面量 python 字典 key:value 键值对
dict1 = {"name":"过大侠","age":20}
dict2 = {"name":"小龙女","city":"地下城"}
dict3 = Merge(dict1,dict2)
print(dict3)